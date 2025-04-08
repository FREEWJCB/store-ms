// Importa los locales disponibles en Faker para generar datos en diferentes idiomas
import { en, es, en_US, es_MX, base, Faker } from '@faker-js/faker';

// Crea una nueva instancia de Faker configurada con una lista de idiomas en orden de prioridad
export const faker = new Faker({
  // Prioriza el uso del español mexicano, luego español general, luego inglés de EE.UU., inglés general, y finalmente la configuración base
  locale: [es_MX, es, en_US, en, base],
});
