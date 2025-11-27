import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Macroproceso from '#models/macroproceso'

export default class extends BaseSeeder {
  async run() {
    await Macroproceso.createMany([
      {
        codigo: 'DIR',
        nombre: 'Direccionamiento',
        color: '#003595',
        icono: 'fa-compass',
        orden: 1,
        activo: true,
      },
      {
        codigo: 'ING',
        nombre: 'Ingenieria',
        color: '#4facfe',
        icono: 'fa-code',
        orden: 2,
        activo: true,
      },
      {
        codigo: 'COM',
        nombre: 'Comercial',
        color: '#df6a2e',
        icono: 'fa-handshake',
        orden: 3,
        activo: true,
      },
      {
        codigo: 'CON',
        nombre: 'Consultoria',
        color: '#9C27B0',
        icono: 'fa-lightbulb',
        orden: 4,
        activo: true,
      },
      {
        codigo: 'TH',
        nombre: 'Talento Humano',
        color: '#c2d500',
        icono: 'fa-users-cog',
        orden: 5,
        activo: true,
      },
      {
        codigo: 'MEJ',
        nombre: 'Mejoramiento',
        color: '#00BCD4',
        icono: 'fa-chart-line',
        orden: 6,
        activo: true,
      },
      {
        codigo: 'PRO',
        nombre: 'Procesos',
        color: '#607D8B',
        icono: 'fa-cogs',
        orden: 7,
        activo: true,
      },
    ])
  }
}
