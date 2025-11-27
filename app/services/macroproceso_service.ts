import Macroproceso from '#models/macroproceso'

export default class MacroprocesoService {
  /**
   * Obtener todos los macroprocesos activos ordenados
   */
  async getAll() {
    return Macroproceso.query()
      .where('activo', true)
      .orderBy('orden', 'asc')
  }

  /**
   * Obtener todos los macroprocesos con sus procesos
   */
  async getAllWithProcesos() {
    return Macroproceso.query()
      .where('activo', true)
      .preload('procesos', (query) => {
        query.where('activo', true).orderBy('orden', 'asc')
      })
      .orderBy('orden', 'asc')
  }

  /**
   * Obtener macroproceso por ID
   */
  async getById(id: number) {
    return Macroproceso.find(id)
  }

  /**
   * Obtener macroproceso por ID con sus procesos
   */
  async getByIdWithProcesos(id: number) {
    return Macroproceso.query()
      .where('id', id)
      .preload('procesos', (query) => {
        query.where('activo', true).orderBy('orden', 'asc')
      })
      .first()
  }

  /**
   * Obtener lista para select/dropdown (solo id y nombre)
   */
  async getForSelect() {
    const macroprocesos = await Macroproceso.query()
      .where('activo', true)
      .orderBy('orden', 'asc')
      .select(['id', 'codigo', 'nombre', 'color'])

    return macroprocesos.map((mp) => ({
      id: mp.id,
      codigo: mp.codigo,
      nombre: mp.nombre,
      color: mp.color,
    }))
  }
}
