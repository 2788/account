import { FastifyRequest } from 'fastify'

export type Test = 'test'

declare global {
  type WithBody<T> = FastifyRequest<{ Body: T }>
  type WithParams<T> = FastifyRequest<{ Params: T }>
  type WithQuery<P, B> = FastifyRequest<{ Params: P; Body: B }>
}

export type Pagination = {
  limit: number
  offset: number
  sort: Array<[key: string, order: 'DESC' | 'ASC']>
}
