
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('poll', (table) => {
      table.increments();
      table.string('name');
      table.string('url');
      table.string('email');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('poll')
  ])
};

