import qs from 'qs';
import { FastifyRequest, FastifyReply } from 'fastify';

export async function parseNestedQueryParams(
  request: FastifyRequest,
  _reply: FastifyReply,
) {
  // Si la URL contiene parámetros de consulta
  if (typeof request.raw.url === 'string' && request.raw.url.includes('?')) {
    const [, queryStr] = request.raw.url.split('?'); // Separa la ruta de los parámetros
    request.query = qs.parse(queryStr || '') as any; // Parsea los parámetros anidados usando `qs`
  }
}
