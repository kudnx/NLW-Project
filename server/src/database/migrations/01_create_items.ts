import Knex from 'knex'

export async function up(Knex: Knex) {
  //cria a tabela
  return Knex.schema.createTable('items', table => {
    table.increments('id').primary()
    table.string('image').notNullable()
    table.string('title').notNullable()
  })
}

export async function down(knex: Knex) {
  //deleta a tabela, faz o contrario do metodo up
  return knex.schema.dropTable('items')
}
