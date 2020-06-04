import Knex from 'knex'

export async function up(Knex: Knex) {
  //cria a tabela
  return Knex.schema.createTable('points', table => {
    table.increments('id').primary()
    table.string('image').notNullable()
    table.string('name').notNullable()
    table.string('email').notNullable()
    table.string('whattsapp').notNullable()
    table.decimal('latitude').notNullable()
    table.decimal('longitude').notNullable()
    table.string('city').notNullable()
    table.string('uf', 2).notNullable()
  })
}

export async function down(knex: Knex) {
  //deleta a tabela, faz o contrario do metodo up
  return knex.schema.dropTable('points')
}
