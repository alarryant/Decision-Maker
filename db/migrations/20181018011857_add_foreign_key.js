
exports.up = function(knex, Promise) {
  return knex.schema.table('option', (option) => {
    option.integer('poll_id');
    option.foreign('poll_id')
    .references('poll.id')
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('option', (option) => {
    option.dropColumn('poll.id');
  })
};
