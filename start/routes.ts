/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const MacroprocesosController = () => import('#controllers/macroprocesos_controller')
const ProcesosController = () => import('#controllers/procesos_controller')
const IndicadoresController = () => import('#controllers/indicadores_controller')
const IndicadorMedicionesController = () => import('#controllers/indicador_mediciones_controller')

// Health check
router.get('/', async () => {
  return {
    status: 'ok',
    message: 'Sistema de Gestion Cognox API',
    version: '1.0.0',
  }
})

// API Routes
router
  .group(() => {
    // Macroprocesos
    router.get('/macroprocesos', [MacroprocesosController, 'index'])
    router.get('/macroprocesos/select', [MacroprocesosController, 'select'])
    router.get('/macroprocesos/:id', [MacroprocesosController, 'show'])
    router.get('/macroprocesos/:id/procesos', [MacroprocesosController, 'procesos'])

    // Procesos
    router.get('/procesos', [ProcesosController, 'index'])
    router.get('/procesos/select', [ProcesosController, 'select'])
    router.get('/procesos/grouped', [ProcesosController, 'grouped'])
    router.get('/procesos/:id', [ProcesosController, 'show'])

    // Indicadores
    router.get('/indicadores', [IndicadoresController, 'index'])
    router.get('/indicadores/stats', [IndicadoresController, 'stats'])
    router.get('/indicadores/grouped', [IndicadoresController, 'grouped'])
    router.get('/indicadores/por-proceso/:procesoId', [IndicadoresController, 'porProceso'])
    router.get('/indicadores/:id', [IndicadoresController, 'show'])

    // Mediciones de Indicadores
    router.get('/mediciones', [IndicadorMedicionesController, 'index'])
    router.post('/mediciones', [IndicadorMedicionesController, 'store'])
    router.post('/mediciones/upsert', [IndicadorMedicionesController, 'upsert'])
    router.get('/mediciones/:id', [IndicadorMedicionesController, 'show'])
    router.put('/mediciones/:id', [IndicadorMedicionesController, 'update'])
    router.delete('/mediciones/:id', [IndicadorMedicionesController, 'destroy'])

    // Mediciones por Indicador
    router.get('/mediciones/indicador/:indicadorId/anio/:anio', [IndicadorMedicionesController, 'porIndicadorAnio'])
    router.get('/mediciones/indicador/:indicadorId/estadisticas', [IndicadorMedicionesController, 'estadisticas'])
    router.get('/mediciones/indicador/:indicadorId/grafico', [IndicadorMedicionesController, 'datosGrafico'])
    router.get('/mediciones/indicador/:indicadorId/resumen', [IndicadorMedicionesController, 'resumen'])
    router.get('/mediciones/indicador/:indicadorId/anios', [IndicadorMedicionesController, 'aniosDisponibles'])
  })
  .prefix('/api')
