import { FastifyPluginAsync, FastifyPluginCallback } from 'fastify'

export const user: FastifyPluginAsync =  async (app) => {
  app.all('*', (request, reply) => {})
}
