import type { HttpContext } from '@adonisjs/core/http'
import IndicadorService from '#services/indicador_service'

export default class IndicadoresController {
  private indicadorService: IndicadorService

  constructor() {
    this.indicadorService = new IndicadorService()
  }

  /**
   * GET /api/indicadores
   * Lista todos los indicadores con filtros opcionales
   * Query params: macroproceso_id, proceso_id, tipo
   */
  async index({ request, response }: HttpContext) {
    try {
      const macroprocesoId = request.input('macroproceso_id')
      const procesoId = request.input('proceso_id')
      const tipo = request.input('tipo')

      const indicadores = await this.indicadorService.getAllForTable({
        macroprocesoId: macroprocesoId ? Number(macroprocesoId) : undefined,
        procesoId: procesoId ? Number(procesoId) : undefined,
        tipo: tipo || undefined,
      })

      return response.ok({
        success: true,
        data: indicadores,
        total: indicadores.length,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error al obtener indicadores',
        error: error.message,
      })
    }
  }

  /**
   * GET /api/indicadores/stats
   * Obtiene estadísticas de indicadores
   */
  async stats({ response }: HttpContext) {
    try {
      const stats = await this.indicadorService.getStats()

      return response.ok({
        success: true,
        data: stats,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error al obtener estadisticas',
        error: error.message,
      })
    }
  }

  /**
   * GET /api/indicadores/grouped
   * Lista indicadores agrupados por macroproceso y proceso
   */
  async grouped({ response }: HttpContext) {
    try {
      const grouped = await this.indicadorService.getAllGrouped()

      return response.ok({
        success: true,
        data: grouped,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error al obtener indicadores agrupados',
        error: error.message,
      })
    }
  }

  /**
   * GET /api/indicadores/:id
   * Obtiene un indicador por ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const indicador = await this.indicadorService.getById(params.id)

      if (!indicador) {
        return response.notFound({
          success: false,
          message: 'Indicador no encontrado',
        })
      }

      return response.ok({
        success: true,
        data: {
          id: indicador.id,
          codigo: indicador.codigo,
          macroproceso: indicador.proceso?.macroproceso?.nombre || '',
          macroprocesoId: indicador.proceso?.macroproceso?.id || null,
          proceso: indicador.proceso?.nombre || '',
          procesoId: indicador.procesoId,
          nombre: indicador.nombre,
          formula: indicador.formula,
          unidad: indicador.unidad,
          frecuencia: indicador.frecuencia,
          tipo: indicador.tipo,
          meta: indicador.meta,
          responsable: indicador.responsable,
          descripcion: indicador.descripcion,
        },
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error al obtener indicador',
        error: error.message,
      })
    }
  }

  /**
   * GET /api/indicadores/por-proceso/:procesoId
   * Obtiene indicadores de un proceso específico
   */
  async porProceso({ params, response }: HttpContext) {
    try {
      const indicadores = await this.indicadorService.getByProcesoId(params.procesoId)

      return response.ok({
        success: true,
        data: indicadores.map((ind) => ({
          id: ind.id,
          codigo: ind.codigo,
          nombre: ind.nombre,
          formula: ind.formula,
          unidad: ind.unidad,
          frecuencia: ind.frecuencia,
          tipo: ind.tipo,
          meta: ind.meta,
          responsable: ind.responsable,
        })),
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error al obtener indicadores del proceso',
        error: error.message,
      })
    }
  }
}
