import { truncateTables } from '../../sql/helpers';
import subjects from './../lookup/subjects';

export async function seed(knex, Promise) {
  await truncateTables(knex, Promise, ['subject', 'activity']);

  await Promise.all(
    subjects.map(async s => {
      const tempSubject = s;
      const subject = await knex('subject')
        .returning('id')
        .insert({
          name: `${s.name}`
        });
      //console.log("seeds", "tempSubject", JSON.stringify(tempSubject));
      console.log('seeds', 'subject', JSON.stringify(subject));

      await Promise.all(
        tempSubject.activities.map(async a => {
          return knex('activity')
            .returning('id')
            .insert({
              subject: tempSubject.name,
              name: a.name,
              type: a.type
            });
        })
      );
    })
  );
}
