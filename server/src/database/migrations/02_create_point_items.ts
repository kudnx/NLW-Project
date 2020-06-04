import Knex from 'knex'

export async function up(Knex: Knex) {
  //cria a tabela
  return Knex.schema.createTable('point_items', table => {
    table.increments('id').primary()
    table.integer('point_id').notNullable().references('id').inTable('points')
    table.integer('item_id').notNullable().references('id').inTable('Items')
  })
}

export async function down(knex: Knex) {
  //deleta a tabela, faz o contrario do metodo up
  return knex.schema.dropTable('point_items')
}
