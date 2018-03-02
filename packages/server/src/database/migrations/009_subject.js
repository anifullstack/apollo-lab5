exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema
      .createTable("subject", table => {
        table.increments();

        table.string("name");
        table.timestamps(false, true);
      })
      .createTable("activity", table => {
        table.increments();
        table.string("subject");
        table.string("name");
        table.string("type");

        table.string("description");
        table.timestamps(false, true);
      })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable("activity"),
    knex.schema.dropTable("student")
  ]);
};
