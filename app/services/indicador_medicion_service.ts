import IndicadorMedicion from '#models/indicador_medicion'
import Indicador from '#models/indicador'
import db from '@adonisjs/lucid/services/db'

interface MedicionInput {
  indicadorId: number
  anio: number
  mes: number
  valor: number
  metaPeriodo?: number | null
  numerador?: number | null
  denominador?: number | null
  observaciones?: string | null
  registradoPor?: string | null
  estado?: 'borrador' | 'confirmado' | 'revisado'
}

interface MedicionFilters {
  indicadorId?: number
  anio?: number
  mes?: number
  estado?: string
}

export default class IndicadorMedicionService {
  /**
   * Crear una nueva medición
   */
  async create(data: MedicionInput) {
    // Verificar que el indicador existe
    const indicador = await Indicador.find(data.indicadorId)
    if (!indicador) {
      throw new Error('Indicador no encontrado')
    }

    // Verificar si ya existe una medición para este periodo
    const existente = await IndicadorMedicion.query()
      .where('indicador_id', data.indicadorId)
      .where('anio', data.anio)
      .where('mes', data.mes)
      .first()

    if (existente) {
      throw new Error(`Ya existe una medición para ${data.mes}/${data.anio}`)
    }

    const medicion = await IndicadorMedicion.create({
      indicadorId: data.indicadorId,
      anio: data.anio,
      mes: data.mes,
      valor: data.valor,
      metaPeriodo: data.metaPeriodo ?? null,
      numerador: data.numerador ?? null,
      denominador: data.denominador ?? null,
      observaciones: data.observaciones ?? null,
      registradoPor: data.registradoPor ?? null,
      estado: data.estado ?? 'confirmado',
    })

    return medicion
  }

  /**
   * Actualizar una medición existente
   */
  async update(id: number, data: Partial<MedicionInput>) {
    const medicion = await IndicadorMedicion.find(id)
    if (!medicion) {
      throw new Error('Medición no encontrada')
    }

    // Si se cambia el periodo, verificar que no exista otra medición
    if (data.anio !== undefined || data.mes !== undefined) {
      const anio = data.anio ?? medicion.anio
      const mes = data.mes ?? medicion.mes

      const existente = await IndicadorMedicion.query()
        .where('indicador_id', medicion.indicadorId)
        .where('anio', anio)
        .where('mes', mes)
        .whereNot('id', id)
        .first()

      if (existente) {
        throw new Error(`Ya existe una medición para ${mes}/${anio}`)
      }
    }

    medicion.merge({
      anio: data.anio ?? medicion.anio,
      mes: data.mes ?? medicion.mes,
      valor: data.valor ?? medicion.valor,
      metaPeriodo: data.metaPeriodo !== undefined ? data.metaPeriodo : medicion.metaPeriodo,
      numerador: data.numerador !== undefined ? data.numerador : medicion.numerador,
      denominador: data.denominador !== undefined ? data.denominador : medicion.denominador,
      observaciones: data.observaciones !== undefined ? data.observaciones : medicion.observaciones,
      registradoPor: data.registradoPor !== undefined ? data.registradoPor : medicion.registradoPor,
      estado: data.estado ?? medicion.estado,
    })

    await medicion.save()
    return medicion
  }

  /**
   * Eliminar una medición
   */
  async delete(id: number) {
    const medicion = await IndicadorMedicion.find(id)
    if (!medicion) {
      throw new Error('Medición no encontrada')
    }

    await medicion.delete()
    return true
  }

  /**
   * Obtener una medición por ID
   */
  async getById(id: number) {
    return IndicadorMedicion.query()
      .where('id', id)
      .preload('indicador', (query) => {
        query.preload('proceso', (procesoQuery) => {
          procesoQuery.preload('macroproceso')
        })
      })
      .first()
  }

  /**
   * Obtener mediciones con filtros
   */
  async getAll(filters: MedicionFilters = {}) {
    const query = IndicadorMedicion.query()
      .preload('indicador')
      .orderBy('anio', 'desc')
      .orderBy('mes', 'desc')

    if (filters.indicadorId) {
      query.where('indicador_id', filters.indicadorId)
    }

    if (filters.anio) {
      query.where('anio', filters.anio)
    }

    if (filters.mes) {
      query.where('mes', filters.mes)
    }

    if (filters.estado) {
      query.where('estado', filters.estado)
    }

    return query
  }

  /**
   * Obtener mediciones de un indicador por año
   */
  async getMedicionesPorIndicadorAnio(indicadorId: number, anio: number) {
    const mediciones = await IndicadorMedicion.query()
      .where('indicador_id', indicadorId)
      .where('anio', anio)
      .orderBy('mes', 'asc')

    // Crear array con 12 meses (null si no hay dato)
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    const datos = meses.map((mes, index) => {
      const medicion = mediciones.find((m) => m.mes === index + 1)
      return {
        mes: mes,
        mesNumero: index + 1,
        valor: medicion?.valor ?? null,
        numerador: medicion?.numerador ?? null,
        denominador: medicion?.denominador ?? null,
        meta: medicion?.metaPeriodo ?? null,
        id: medicion?.id ?? null,
        estado: medicion?.estado ?? null,
      }
    })

    return datos
  }

  /**
   * Obtener estadísticas de un indicador
   */
  async getEstadisticas(indicadorId: number, anio?: number) {
    const query = IndicadorMedicion.query()
      .where('indicador_id', indicadorId)
      .where('estado', 'confirmado')

    if (anio) {
      query.where('anio', anio)
    }

    const mediciones = await query

    if (mediciones.length === 0) {
      return {
        promedio: null,
        maximo: null,
        minimo: null,
        totalRegistros: 0,
        ultimoValor: null,
        tendencia: null,
      }
    }

    const valores = mediciones.map((m) => Number(m.valor))
    const promedio = valores.reduce((a, b) => a + b, 0) / valores.length
    const maximo = Math.max(...valores)
    const minimo = Math.min(...valores)

    // Ordenar por fecha para obtener el último valor
    const ordenadas = mediciones.sort((a, b) => {
      if (a.anio !== b.anio) return b.anio - a.anio
      return b.mes - a.mes
    })

    const ultimoValor = ordenadas[0]?.valor ?? null

    // Calcular tendencia (comparando últimos dos valores)
    let tendencia: 'subiendo' | 'bajando' | 'estable' | null = null
    if (ordenadas.length >= 2) {
      const diff = Number(ordenadas[0].valor) - Number(ordenadas[1].valor)
      if (diff > 0) tendencia = 'subiendo'
      else if (diff < 0) tendencia = 'bajando'
      else tendencia = 'estable'
    }

    return {
      promedio: Math.round(promedio * 100) / 100,
      maximo,
      minimo,
      totalRegistros: mediciones.length,
      ultimoValor,
      tendencia,
    }
  }

  /**
   * Obtener datos para el gráfico de un indicador
   */
  async getDatosGrafico(indicadorId: number, anio: number) {
    const indicador = await Indicador.find(indicadorId)
    if (!indicador) {
      throw new Error('Indicador no encontrado')
    }

    const mediciones = await this.getMedicionesPorIndicadorAnio(indicadorId, anio)

    return {
      labels: mediciones.map((m) => m.mes),
      datasets: [
        {
          label: 'Valor',
          data: mediciones.map((m) => m.valor),
          borderColor: '#003595',
          backgroundColor: 'rgba(0, 53, 149, 0.1)',
          fill: true,
        },
        {
          label: 'Meta',
          data: mediciones.map((m) => m.meta ?? (indicador.meta ? parseFloat(indicador.meta) : null)),
          borderColor: '#8BC34A',
          borderDash: [5, 5],
          fill: false,
        },
      ],
    }
  }

  /**
   * Obtener resumen de mediciones por indicador para el tablero
   */
  async getResumenPorIndicador(indicadorId: number) {
    const indicador = await Indicador.query()
      .where('id', indicadorId)
      .preload('proceso', (query) => {
        query.preload('macroproceso')
      })
      .first()

    if (!indicador) {
      throw new Error('Indicador no encontrado')
    }

    const anioActual = new Date().getFullYear()
    const estadisticas = await this.getEstadisticas(indicadorId, anioActual)
    const medicionesMes = await this.getMedicionesPorIndicadorAnio(indicadorId, anioActual)
    const datosGrafico = await this.getDatosGrafico(indicadorId, anioActual)

    return {
      indicador: {
        id: indicador.id,
        codigo: indicador.codigo,
        nombre: indicador.nombre,
        formula: indicador.formula,
        unidad: indicador.unidad,
        frecuencia: indicador.frecuencia,
        tipo: indicador.tipo,
        meta: indicador.meta,
        responsable: indicador.responsable,
        macroproceso: indicador.proceso?.macroproceso?.nombre || '',
        proceso: indicador.proceso?.nombre || '',
      },
      estadisticas,
      medicionesMes,
      datosGrafico,
      anio: anioActual,
    }
  }

  /**
   * Crear o actualizar medición (upsert)
   */
  async upsert(data: MedicionInput) {
    const existente = await IndicadorMedicion.query()
      .where('indicador_id', data.indicadorId)
      .where('anio', data.anio)
      .where('mes', data.mes)
      .first()

    if (existente) {
      return this.update(existente.id, data)
    } else {
      return this.create(data)
    }
  }

  /**
   * Obtener años disponibles con mediciones para un indicador
   */
  async getAniosDisponibles(indicadorId: number) {
    const result = await db
      .from('indicador_mediciones')
      .where('indicador_id', indicadorId)
      .select('anio')
      .distinct('anio')
      .orderBy('anio', 'desc')

    return result.map((r) => r.anio)
  }
}
