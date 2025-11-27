import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Indicador from '#models/indicador'

export default class IndicadorMedicion extends BaseModel {
  static table = 'indicador_mediciones'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare indicadorId: number

  @column()
  declare anio: number

  @column()
  declare mes: number

  @column()
  declare valor: number

  @column()
  declare metaPeriodo: number | null

  @column()
  declare numerador: number | null

  @column()
  declare denominador: number | null

  @column()
  declare observaciones: string | null

  @column()
  declare registradoPor: string | null

  @column()
  declare estado: 'borrador' | 'confirmado' | 'revisado'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relaciones
  @belongsTo(() => Indicador)
  declare indicador: BelongsTo<typeof Indicador>

  // Helpers
  get periodoFormateado(): string {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    return `${meses[this.mes - 1]} ${this.anio}`
  }

  get mesNombre(): string {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    return meses[this.mes - 1]
  }
}
