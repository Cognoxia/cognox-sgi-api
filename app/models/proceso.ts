import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Macroproceso from '#models/macroproceso'
import Indicador from '#models/indicador'

export default class Proceso extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare codigo: string

  @column()
  declare nombre: string

  @column()
  declare macroprocesoId: number

  @column()
  declare responsable: string | null

  @column()
  declare descripcion: string | null

  @column()
  declare orden: number

  @column()
  declare activo: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Macroproceso)
  declare macroproceso: BelongsTo<typeof Macroproceso>

  @hasMany(() => Indicador)
  declare indicadores: HasMany<typeof Indicador>
}
