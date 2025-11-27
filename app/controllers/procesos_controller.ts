import type { HttpContext } from '@adonisjs/core/http'
import ProcesoService from '#services/proceso_service'

export default class ProcesosController {
  private procesoService: ProcesoService

  constructor() {
    this.procesoService = new ProcesoService()
  }

  /**
   * GET /api/procesos
   * Lista todos los procesos activos
   * Query params: macroproceso_id (opcional)
   */
  async index({ request, response }: HttpContext) {
    try {
      const macroprocesoId = request.input('macroproceso_id')

      let procesos
      if (macroprocesoId) {
        procesos = await this.procesoService.getByMacroprocesoId(Number(macroprocesoId))
      } else {
        procesos = await this.procesoService.getAll()
      }

      return response.ok({
        success: true,
        data: procesos,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error al obtener procesos',
        error: error.message,
      })
    }
  }

  /**
   * GET /api/procesos/select
   * Lista para dropdown/select (formato simplificado)
   * Query params: macroproceso_id (opcional)
   */
  async select({ request, response }: HttpContext) {
    try {
      const macroprocesoId = request.input('macroproceso_id')
      const procesos = await this.procesoService.getForSelect(
        macroprocesoId ? Number(macroprocesoId) : undefined
      )

      return response.ok({
        success: true,
        data: procesos,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error al obtener procesos',
        error: error.message,
      })
    }
  }

  /**
   * GET /api/procesos/grouped
   * Lista todos los procesos agrupados por macroproceso
   */
  async grouped({ response }: HttpContext) {
    try {
      const grouped = await this.procesoService.getAllGroupedByMacroproceso()
      return response.ok({
        success: true,
        data: grouped,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error al obtener procesos agrupados',
        error: error.message,
      })
    }
  }

  /**
   * GET /api/procesos/:id
   * Obtiene un proceso por ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const proceso = await this.procesoService.getById(params.id)

      if (!proceso) {
        return response.notFound({
          success: false,
          message: 'Proceso no encontrado',
        })
      }

      return response.ok({
        success: true,
        data: proceso,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error al obtener proceso',
        error: error.message,
      })
    }
  }
}
