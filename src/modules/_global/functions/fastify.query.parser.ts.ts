// utils/fastify-query-parser.ts
import qs from 'qs';
import { FastifyRequest, FastifyReply } from 'fastify';

export async function parseNestedQueryParams(
  request: FastifyRequest,
  _reply: FastifyReply,
) {
  if (typeof request.raw.url === 'string' && request.raw.url.includes('?')) {
    const [, queryStr] = request.raw.url.split('?');
    request.query = qs.parse(queryStr || '') as any;
  }
}
