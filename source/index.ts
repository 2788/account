import Fastify from 'fastify'

import pkg from '../package.json'

import { routes as userRoutes } from './modules/user'
import { routes as secretRoutes } from './modules/secret'

console.log("Version:", pkg.version)

const apiPort = process.env.API_PORT
const debugLog = process.env.DEBUG_LOG
const fastify = Fastify({ logger: debugLog == 'true' })

fastify.register(userRoutes)
fastify.register(secretRoutes)

fastify.listen({ port: Number(apiPort), host: '0.0.0.0' })
  .then(() => console.log(`api server started on port ${apiPort}`))
  .catch(error => console.error('api server listen error', error))
