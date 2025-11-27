import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'macroprocesos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('codigo', 20).notNullable().unique()
      table.string('nombre', 100).notNullable()
      table.string('color', 20).nullable()
      table.string('icono', 50).nullable()
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
