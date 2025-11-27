import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Proceso from '#models/proceso'
import IndicadorMedicion from '#models/indicador_medicion'

export default class Indicador extends BaseModel {
  static table = 'indicadores'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare codigo: string

  @column()
  declare procesoId: number

  @column()
  declare nombre: string

  @column()
  declare formula: string

  @column()
  declare unidad: string

  @column()
  declare frecuencia: string

  @column()
  declare tipo: 'Eficacia' | 'Eficiencia' | 'Calidad'

  @column()
  declare meta: string | null

  @column()
  declare responsable: string

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

  @belongsTo(() => Proceso)
  declare proceso: BelongsTo<typeof Proceso>

  @hasMany(() => IndicadorMedicion)
  declare mediciones: HasMany<typeof IndicadorMedicion>
}
