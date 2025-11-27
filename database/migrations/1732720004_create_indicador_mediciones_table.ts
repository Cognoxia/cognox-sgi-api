import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'indicador_mediciones'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Relación con indicador
      table.integer('indicador_id').unsigned().references('id').inTable('indicadores').onDelete('CASCADE').notNullable()

      // Periodo de la medición
      table.integer('anio').notNullable() // Año (2024, 2025, etc.)
      table.integer('mes').notNullable() // Mes (1-12)

      // Valor medido
      table.decimal('valor', 10, 2).notNullable()

      // Meta específica del periodo (opcional, si difiere de la meta general)
      table.decimal('meta_periodo', 10, 2).nullable()

      // Datos de numerador y denominador para trazabilidad
      table.decimal('numerador', 10, 2).nullable()
      table.decimal('denominador', 10, 2).nullable()

      // Observaciones
      table.text('observaciones').nullable()

      // Quién registró el dato
      table.string('registrado_por', 255).nullable()

      // Estado del registro
      table.enum('estado', ['borrador', 'confirmado', 'revisado']).defaultTo('confirmado')

      // Timestamps
      table.timestamp('created_at')
      table.timestamp('updated_at')

      // Índices
      table.index(['indicador_id', 'anio', 'mes'])
      table.unique(['indicador_id', 'anio', 'mes']) // Solo un registro por indicador/periodo
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
