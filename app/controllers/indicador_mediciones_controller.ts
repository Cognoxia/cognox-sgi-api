import type { HttpContext } from '@adonisjs/core/http'
import IndicadorMedicionService from '#services/indicador_medicion_service'

export default class IndicadorMedicionesController {
  private medicionService: IndicadorMedicionService

  constructor() {
    this.medicionService = new IndicadorMedicionService()
  }

  /**
   * POST /api/mediciones
   * Crear una nueva medición
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = request.only([
        'indicador_id',
        'anio',
        'mes',
        'valor',
        'meta_periodo',
        'numerador',
        'denominador',
        'observaciones',
        'registrado_por',
        'estado',
      ])

      const medicion = await this.medicionService.create({
        indicadorId: data.indicador_id,
        anio: data.anio,
        mes: data.mes,
        valor: data.valor,
        metaPeriodo: data.meta_periodo,
        numerador: data.numerador,
        denominador: data.denominador,
        observaciones: data.observaciones,
        registradoPor: data.registrado_por,
        estado: data.estado,
      })

      return response.created({
        success: true,
        message: 'Medición registrada exitosamente',
        data: medicion,
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: error.message || 'Error al registrar la medición',
      })
    }
  }

  /**
   * PUT /api/mediciones/:id
   * Actualizar una medición
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const data = request.only([
        'anio',
        'mes',
        'valor',
        'meta_periodo',
        'numerador',
        'denominador',
        'observaciones',
        'registrado_por',
        'estado',
      ])

      const medicion = await this.medicionService.update(params.id, {
        anio: data.anio,
        mes: data.mes,
        valor: data.valor,
        metaPeriodo: data.meta_periodo,
        numerador: data.numerador,
        denominador: data.denominador,
        observaciones: data.observaciones,
        registradoPor: data.registrado_por,
        estado: data.estado,
      })

      return response.ok({
        success: true,
        message: 'Medición actualizada exitosamente',
        data: medicion,
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: error.message || 'Error al actualizar la medición',
      })
    }
  }

  /**
   * DELETE /api/mediciones/:id
   * Eliminar una medición
   */
  async destroy({ params, response }: HttpContext) {
    try {
      await this.medicionService.delete(params.id)

      return response.ok({
        success: true,
        message: 'Medición eliminada exitosamente',
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: error.message || 'Error al eliminar la medición',
      })
    }
  }

  /**
   * GET /api/mediciones/:id
   * Obtener una medición por ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const medicion = await this.medicionService.getById(params.id)

      if (!medicion) {
        return response.notFound({
          success: false,
          message: 'Medición no encontrada',
        })
      }

      return response.ok({
        success: true,
        data: medicion,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error al obtener la medición',
        error: error.message,
      })
    }
  }

  /**
   * GET /api/mediciones
   * Listar mediciones con filtros
   */
  async index({ request, response }: HttpContext) {
    try {
      const indicadorId = request.input('indicador_id')
      const anio = request.input('anio')
      const mes = request.input('mes')
      const estado = request.input('estado')

      const mediciones = await this.medicionService.getAll({
        indicadorId: indicadorId ? Number(indicadorId) : undefined,
        anio: anio ? Number(anio) : undefined,
        mes: mes ? Number(mes) : undefined,
        estado: estado || undefined,
      })

      return response.ok({
        success: true,
        data: mediciones,
        total: mediciones.length,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error al obtener mediciones',
        error: error.message,
      })
    }
  }

  /**
   * GET /api/mediciones/indicador/:indicadorId/anio/:anio
   * Obtener mediciones de un indicador por año (para la tabla mensual)
   */
  async porIndicadorAnio({ params, response }: HttpContext) {
    try {
      const mediciones = await this.medicionService.getMedicionesPorIndicadorAnio(
        Number(params.indicadorId),
        Number(params.anio)
      )

      return response.ok({
        success: true,
        data: mediciones,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error al obtener mediciones',
        error: error.message,
      })
    }
  }

  /**
   * GET /api/mediciones/indicador/:indicadorId/estadisticas
   * Obtener estadísticas de un indicador
   */
  async estadisticas({ params, request, response }: HttpContext) {
    try {
      const anio = request.input('anio')
      const estadisticas = await this.medicionService.getEstadisticas(
        Number(params.indicadorId),
        anio ? Number(anio) : undefined
      )

      return response.ok({
        success: true,
        data: estadisticas,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error al obtener estadísticas',
        error: error.message,
      })
    }
  }

  /**
   * GET /api/mediciones/indicador/:indicadorId/grafico
   * Obtener datos para el gráfico de un indicador
   */
  async datosGrafico({ params, request, response }: HttpContext) {
    try {
      const anio = request.input('anio') || new Date().getFullYear()
      const datos = await this.medicionService.getDatosGrafico(
        Number(params.indicadorId),
        Number(anio)
      )

      return response.ok({
        success: true,
        data: datos,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error al obtener datos del gráfico',
        error: error.message,
      })
    }
  }

  /**
   * GET /api/mediciones/indicador/:indicadorId/resumen
   * Obtener resumen completo de un indicador (para vista de detalle)
   */
  async resumen({ params, response }: HttpContext) {
    try {
      const resumen = await this.medicionService.getResumenPorIndicador(Number(params.indicadorId))

      return response.ok({
        success: true,
        data: resumen,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error al obtener resumen del indicador',
        error: error.message,
      })
    }
  }

  /**
   * GET /api/mediciones/indicador/:indicadorId/anios
   * Obtener años disponibles con mediciones
   */
  async aniosDisponibles({ params, response }: HttpContext) {
    try {
      const anios = await this.medicionService.getAniosDisponibles(Number(params.indicadorId))

      return response.ok({
        success: true,
        data: anios,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error al obtener años disponibles',
        error: error.message,
      })
    }
  }

  /**
   * POST /api/mediciones/upsert
   * Crear o actualizar medición
   */
  async upsert({ request, response }: HttpContext) {
    try {
      const data = request.only([
        'indicador_id',
        'anio',
        'mes',
        'valor',
        'meta_periodo',
        'numerador',
        'denominador',
        'observaciones',
        'registrado_por',
        'estado',
      ])

      const medicion = await this.medicionService.upsert({
        indicadorId: data.indicador_id,
        anio: data.anio,
        mes: data.mes,
        valor: data.valor,
        metaPeriodo: data.meta_periodo,
        numerador: data.numerador,
        denominador: data.denominador,
        observaciones: data.observaciones,
        registradoPor: data.registrado_por,
        estado: data.estado,
      })

      return response.ok({
        success: true,
        message: 'Medición guardada exitosamente',
        data: medicion,
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: error.message || 'Error al guardar la medición',
      })
    }
  }
}
