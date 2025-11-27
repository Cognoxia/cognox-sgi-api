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
  })
  .prefix('/api')
