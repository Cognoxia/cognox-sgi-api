import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'procesos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('codigo', 20).notNullable().unique()
      table.string('nombre', 150).notNullable()
      table
        .integer('macroproceso_id')
        .unsigned()
        .references('id')
        .inTable('macroprocesos')
        .onDelete('CASCADE')
      table.string('responsable', 100).nullable()
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
