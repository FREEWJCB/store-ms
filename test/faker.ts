import { en, es, en_US, es_MX, base, Faker } from '@faker-js/faker';

export const faker = new Faker({
  locale: [es_MX, es, en_US, en, base],
});
