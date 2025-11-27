import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Proceso from '#models/proceso'
import Macroproceso from '#models/macroproceso'

export default class extends BaseSeeder {
  async run() {
    // Obtener IDs de macroprocesos
    const macroprocesos = await Macroproceso.all()
    const getMacroprocesoId = (codigo: string) => {
      const mp = macroprocesos.find((m) => m.codigo === codigo)
      return mp ? mp.id : 1
    }

    await Proceso.createMany([
      // Direccionamiento
      {
        codigo: 'DIR-001',
        nombre: 'Planeacion Estrategica',
        macroprocesoId: getMacroprocesoId('DIR'),
        orden: 1,
        activo: true,
      },
      {
        codigo: 'DIR-002',
        nombre: 'Gestion de Riesgos y Oportunidades',
        macroprocesoId: getMacroprocesoId('DIR'),
        orden: 2,
        activo: true,
      },
      {
        codigo: 'DIR-003',
        nombre: 'Gestion de Soluciones IA',
        macroprocesoId: getMacroprocesoId('DIR'),
        orden: 3,
        activo: true,
      },

      // Ingenieria
      {
        codigo: 'ING-001',
        nombre: 'Planeacion de Proyectos',
        macroprocesoId: getMacroprocesoId('ING'),
        orden: 1,
        activo: true,
      },
      {
        codigo: 'ING-002',
        nombre: 'Ingenieria de Requisitos',
        macroprocesoId: getMacroprocesoId('ING'),
        orden: 2,
        activo: true,
      },
      {
        codigo: 'ING-003',
        nombre: 'Ejecucion y Control de Proyectos',
        macroprocesoId: getMacroprocesoId('ING'),
        orden: 3,
        activo: true,
      },
      {
        codigo: 'ING-004',
        nombre: 'Arquitectura de Software',
        macroprocesoId: getMacroprocesoId('ING'),
        orden: 4,
        activo: true,
      },
      {
        codigo: 'ING-005',
        nombre: 'Desarrollo de Software',
        macroprocesoId: getMacroprocesoId('ING'),
        orden: 5,
        activo: true,
      },
      {
        codigo: 'ING-006',
        nombre: 'Calidad de Software',
        macroprocesoId: getMacroprocesoId('ING'),
        orden: 6,
        activo: true,
      },
      {
        codigo: 'ING-007',
        nombre: 'Mesa de Soporte',
        macroprocesoId: getMacroprocesoId('ING'),
        orden: 7,
        activo: true,
      },

      // Comercial
      {
        codigo: 'COM-001',
        nombre: 'Planeacion y Generacion de Demanda',
        macroprocesoId: getMacroprocesoId('COM'),
        orden: 1,
        activo: true,
      },
      {
        codigo: 'COM-002',
        nombre: 'Propuesta Comercial',
        macroprocesoId: getMacroprocesoId('COM'),
        orden: 2,
        activo: true,
      },
      {
        codigo: 'COM-003',
        nombre: 'Gestion PQRS y Fidelizacion',
        macroprocesoId: getMacroprocesoId('COM'),
        orden: 3,
        activo: true,
      },

      // Consultoria
      {
        codigo: 'CON-001',
        nombre: 'Planeacion del Servicio',
        macroprocesoId: getMacroprocesoId('CON'),
        orden: 1,
        activo: true,
      },
      {
        codigo: 'CON-002',
        nombre: 'Ejecucion Consultoria',
        macroprocesoId: getMacroprocesoId('CON'),
        orden: 2,
        activo: true,
      },

      // Talento Humano
      {
        codigo: 'TH-001',
        nombre: 'Gestion de Ingreso',
        macroprocesoId: getMacroprocesoId('TH'),
        orden: 1,
        activo: true,
      },
      {
        codigo: 'TH-002',
        nombre: 'Induccion',
        macroprocesoId: getMacroprocesoId('TH'),
        orden: 2,
        activo: true,
      },
      {
        codigo: 'TH-003',
        nombre: 'Entrenamiento y Formacion',
        macroprocesoId: getMacroprocesoId('TH'),
        orden: 3,
        activo: true,
      },
      {
        codigo: 'TH-004',
        nombre: 'Gestion del Desempeno',
        macroprocesoId: getMacroprocesoId('TH'),
        orden: 4,
        activo: true,
      },
      {
        codigo: 'TH-005',
        nombre: 'Comunicaciones Internas',
        macroprocesoId: getMacroprocesoId('TH'),
        orden: 5,
        activo: true,
      },
      {
        codigo: 'TH-006',
        nombre: 'Bienestar y Desarrollo Organizacional',
        macroprocesoId: getMacroprocesoId('TH'),
        orden: 6,
        activo: true,
      },
      {
        codigo: 'TH-007',
        nombre: 'SST',
        macroprocesoId: getMacroprocesoId('TH'),
        orden: 7,
        activo: true,
      },

      // Mejoramiento
      {
        codigo: 'MEJ-001',
        nombre: 'Gestion del Cambio',
        macroprocesoId: getMacroprocesoId('MEJ'),
        orden: 1,
        activo: true,
      },
      {
        codigo: 'MEJ-002',
        nombre: 'Mejoramiento Continuo',
        macroprocesoId: getMacroprocesoId('MEJ'),
        orden: 2,
        activo: true,
      },

      // Procesos (Gestion por Procesos)
      {
        codigo: 'PRO-001',
        nombre: 'Aseguramiento de la Calidad',
        macroprocesoId: getMacroprocesoId('PRO'),
        orden: 1,
        activo: true,
      },
      {
        codigo: 'PRO-002',
        nombre: 'Gestion Documental',
        macroprocesoId: getMacroprocesoId('PRO'),
        orden: 2,
        activo: true,
      },
      {
        codigo: 'PRO-003',
        nombre: 'Medicion y Analisis',
        macroprocesoId: getMacroprocesoId('PRO'),
        orden: 3,
        activo: true,
      },
      {
        codigo: 'PRO-004',
        nombre: 'Auditorias',
        macroprocesoId: getMacroprocesoId('PRO'),
        orden: 4,
        activo: true,
      },
    ])
  }
}
