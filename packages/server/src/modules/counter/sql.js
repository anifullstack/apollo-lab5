import knex from '../../sql/connector';

export default class Counter {
  counterQuery() {
    return knex('counter').first();
  }

  addCounter(amount) {
    return knex('counter').increment('amount', amount);
  }
}
