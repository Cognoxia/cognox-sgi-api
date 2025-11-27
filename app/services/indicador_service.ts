import Indicador from '#models/indicador'

interface IndicadorFilters {
  macroprocesoId?: number
  procesoId?: number
  tipo?: string
  activo?: boolean
}

export default class IndicadorService {
  /**
   * Obtener todos los indicadores con filtros opcionales
   */
  async getAll(filters: IndicadorFilters = {}) {
    const query = Indicador.query()
      .preload('proceso', (procesoQuery) => {
        procesoQuery.preload('macroproceso')
      })
      .orderBy('proceso_id', 'asc')
      .orderBy('orden', 'asc')

    // Filtro por activo (por defecto solo activos)
    if (filters.activo !== undefined) {
      query.where('activo', filters.activo)
    } else {
      query.where('activo', true)
    }

    // Filtro por proceso
    if (filters.procesoId) {
      query.where('proceso_id', filters.procesoId)
    }

    // Filtro por macroproceso (requiere join)
    if (filters.macroprocesoId) {
      query.whereHas('proceso', (procesoQuery) => {
        procesoQuery.where('macroproceso_id', filters.macroprocesoId!)
      })
    }

    // Filtro por tipo
    if (filters.tipo) {
      query.where('tipo', filters.tipo)
    }

    return query
  }

  /**
   * Obtener indicadores formateados para la tabla del frontend
   */
  async getAllForTable(filters: IndicadorFilters = {}) {
    const indicadores = await this.getAll(filters)

    return indicadores.map((ind) => ({
      id: ind.id,
      codigo: ind.codigo,
      macroproceso: ind.proceso?.macroproceso?.nombre || '',
      macroprocesoId: ind.proceso?.macroproceso?.id || null,
      macroprocesoColor: ind.proceso?.macroproceso?.color || '#003595',
      proceso: ind.proceso?.nombre || '',
      procesoId: ind.procesoId,
      nombre: ind.nombre,
      formula: ind.formula,
      unidad: ind.unidad,
      frecuencia: ind.frecuencia,
      tipo: ind.tipo,
      meta: ind.meta,
      responsable: ind.responsable,
    }))
  }

  /**
   * Obtener un indicador por ID
   */
  async getById(id: number) {
    return Indicador.query()
      .where('id', id)
      .preload('proceso', (procesoQuery) => {
        procesoQuery.preload('macroproceso')
      })
      .first()
  }

  /**
   * Obtener indicadores por proceso
   */
  async getByProcesoId(procesoId: number) {
    return Indicador.query()
      .where('proceso_id', procesoId)
      .where('activo', true)
      .orderBy('orden', 'asc')
  }

  /**
   * Obtener indicadores agrupados por macroproceso y proceso
   */
  async getAllGrouped() {
    const indicadores = await Indicador.query()
      .where('activo', true)
      .preload('proceso', (procesoQuery) => {
        procesoQuery.preload('macroproceso')
      })
      .orderBy('proceso_id', 'asc')
      .orderBy('orden', 'asc')

    // Agrupar por macroproceso
    const grouped: Record<
      string,
      {
        macroproceso: { id: number; nombre: string; color: string | null }
        procesos: Record<
          string,
          {
            proceso: { id: number; nombre: string }
            indicadores: any[]
          }
        >
      }
    > = {}

    for (const ind of indicadores) {
      const mpNombre = ind.proceso?.macroproceso?.nombre || 'Sin Macroproceso'
      const pNombre = ind.proceso?.nombre || 'Sin Proceso'

      if (!grouped[mpNombre]) {
        grouped[mpNombre] = {
          macroproceso: {
            id: ind.proceso?.macroproceso?.id || 0,
            nombre: mpNombre,
            color: ind.proceso?.macroproceso?.color || null,
          },
          procesos: {},
        }
      }

      if (!grouped[mpNombre].procesos[pNombre]) {
        grouped[mpNombre].procesos[pNombre] = {
          proceso: {
            id: ind.proceso?.id || 0,
            nombre: pNombre,
          },
          indicadores: [],
        }
      }

      grouped[mpNombre].procesos[pNombre].indicadores.push({
        id: ind.id,
        codigo: ind.codigo,
        nombre: ind.nombre,
        formula: ind.formula,
        unidad: ind.unidad,
        frecuencia: ind.frecuencia,
        tipo: ind.tipo,
        meta: ind.meta,
        responsable: ind.responsable,
      })
    }

    // Convertir a array
    return Object.values(grouped).map((mp) => ({
      ...mp,
      procesos: Object.values(mp.procesos),
    }))
  }

  /**
   * Obtener estadísticas de indicadores
   */
  async getStats() {
    const total = await Indicador.query().where('activo', true).count('* as total')
    const porTipo = await Indicador.query()
      .where('activo', true)
      .select('tipo')
      .count('* as cantidad')
      .groupBy('tipo')

    const porMacroproceso = await Indicador.query()
      .where('indicadores.activo', true)
      .join('procesos', 'indicadores.proceso_id', 'procesos.id')
      .join('macroprocesos', 'procesos.macroproceso_id', 'macroprocesos.id')
      .select('macroprocesos.nombre as macroproceso')
      .count('* as cantidad')
      .groupBy('macroprocesos.nombre')

    return {
      total: Number(total[0].$extras.total) || 0,
      porTipo: porTipo.map((t) => ({
        tipo: t.tipo,
        cantidad: Number(t.$extras.cantidad),
      })),
      porMacroproceso: porMacroproceso.map((m) => ({
        macroproceso: m.$extras.macroproceso,
        cantidad: Number(m.$extras.cantidad),
      })),
    }
  }
}
