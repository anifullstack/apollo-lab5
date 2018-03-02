exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema
      .createTable("school", table => {
        table.increments();
        table.string("name");
        table.string("code");
        table.string("pin");
        table.string("address");
        table.timestamps(false, true);
      })
      .createTable("classroom", table => {
        table.increments();
        table
          .integer("school_id")
          .unsigned()
          .references("id")
          .inTable("school")
          .onDelete("CASCADE");
        table.string("name");
        table.string("code");
        table.timestamps(false, true);
      })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable("classroom"),
    knex.schema.dropTable("school")
  ]);
};
