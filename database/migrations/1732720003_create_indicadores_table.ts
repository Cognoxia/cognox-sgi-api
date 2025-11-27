import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'indicadores'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('codigo', 30).notNullable().unique()
      table
        .integer('proceso_id')
        .unsigned()
        .references('id')
        .inTable('procesos')
        .onDelete('CASCADE')
      table.string('nombre', 200).notNullable()
      table.text('formula').notNullable()
      table.string('unidad', 50).notNullable()
      table.string('frecuencia', 50).notNullable()
      table.enum('tipo', ['Eficacia', 'Eficiencia', 'Calidad']).notNullable()
      table.string('meta', 50).nullable()
      table.string('responsable', 100).notNullable()
      table.text('descripcion').nullable()
      table.integer('orden').defaultTo(0)
      table.boolean('activo').defaultTo(true)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
