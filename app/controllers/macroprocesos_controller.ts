import type { HttpContext } from '@adonisjs/core/http'
import MacroprocesoService from '#services/macroproceso_service'

export default class MacroprocesosController {
  private macroprocesoService: MacroprocesoService

  constructor() {
    this.macroprocesoService = new MacroprocesoService()
  }

  /**
   * GET /api/macroprocesos
   * Lista todos los macroprocesos activos
   */
  async index({ response }: HttpContext) {
    try {
      const macroprocesos = await this.macroprocesoService.getAll()
      return response.ok({
        success: true,
        data: macroprocesos,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error al obtener macroprocesos',
        error: error.message,
      })
    }
  }

  /**
   * GET /api/macroprocesos/select
   * Lista para dropdown/select (formato simplificado)
   */
  async select({ response }: HttpContext) {
    try {
      const macroprocesos = await this.macroprocesoService.getForSelect()
      return response.ok({
        success: true,
        data: macroprocesos,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error al obtener macroprocesos',
        error: error.message,
      })
    }
  }

  /**
   * GET /api/macroprocesos/:id
   * Obtiene un macroproceso por ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const macroproceso = await this.macroprocesoService.getById(params.id)

      if (!macroproceso) {
        return response.notFound({
          success: false,
          message: 'Macroproceso no encontrado',
        })
      }

      return response.ok({
        success: true,
        data: macroproceso,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error al obtener macroproceso',
        error: error.message,
      })
    }
  }

  /**
   * GET /api/macroprocesos/:id/procesos
   * Obtiene un macroproceso con sus procesos
   */
  async procesos({ params, response }: HttpContext) {
    try {
      const macroproceso = await this.macroprocesoService.getByIdWithProcesos(params.id)

      if (!macroproceso) {
        return response.notFound({
          success: false,
          message: 'Macroproceso no encontrado',
        })
      }

      return response.ok({
        success: true,
        data: macroproceso,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error al obtener macroproceso con procesos',
        error: error.message,
      })
    }
  }
}
