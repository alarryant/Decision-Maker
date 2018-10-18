
exports.up = function(knex, Promise) {
  return knex.schema.table('poll', (poll) => {
    poll.string('description');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('poll', (poll) => {
    poll.dropColumn('description');
  });
};
