import Proceso from '#models/proceso'

export default class ProcesoService {
  /**
   * Obtener todos los procesos activos ordenados
   */
  async getAll() {
    return Proceso.query()
      .where('activo', true)
      .preload('macroproceso')
      .orderBy('orden', 'asc')
  }

  /**
   * Obtener procesos por macroproceso_id
   */
  async getByMacroprocesoId(macroprocesoId: number) {
    return Proceso.query()
      .where('macroproceso_id', macroprocesoId)
      .where('activo', true)
      .orderBy('orden', 'asc')
  }

  /**
   * Obtener proceso por ID
   */
  async getById(id: number) {
    return Proceso.query()
      .where('id', id)
      .preload('macroproceso')
      .first()
  }

  /**
   * Obtener lista para select/dropdown (solo id y nombre)
   * Opcionalmente filtrado por macroproceso
   */
  async getForSelect(macroprocesoId?: number) {
    const query = Proceso.query()
      .where('activo', true)
      .orderBy('orden', 'asc')
      .select(['id', 'codigo', 'nombre', 'macroproceso_id'])

    if (macroprocesoId) {
      query.where('macroproceso_id', macroprocesoId)
    }

    const procesos = await query

    return procesos.map((p) => ({
      id: p.id,
      codigo: p.codigo,
      nombre: p.nombre,
      macroprocesoId: p.macroprocesoId,
    }))
  }

  /**
   * Obtener todos los procesos agrupados por macroproceso
   */
  async getAllGroupedByMacroproceso() {
    const procesos = await Proceso.query()
      .where('activo', true)
      .preload('macroproceso')
      .orderBy('macroproceso_id', 'asc')
      .orderBy('orden', 'asc')

    // Agrupar por macroproceso
    const grouped: Record<string, { macroproceso: any; procesos: any[] }> = {}

    for (const proceso of procesos) {
      const mpNombre = proceso.macroproceso.nombre
      if (!grouped[mpNombre]) {
        grouped[mpNombre] = {
          macroproceso: {
            id: proceso.macroproceso.id,
            codigo: proceso.macroproceso.codigo,
            nombre: proceso.macroproceso.nombre,
            color: proceso.macroproceso.color,
          },
          procesos: [],
        }
      }
      grouped[mpNombre].procesos.push({
        id: proceso.id,
        codigo: proceso.codigo,
        nombre: proceso.nombre,
      })
    }

    return Object.values(grouped)
  }
}
