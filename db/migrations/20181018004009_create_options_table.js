
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('option', (table) => {
      table.increments();
      table.string('text');
      table.integer('votes');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('option')
  ])
};


