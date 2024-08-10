import Fastify from 'fastify'

import pkg from '../package.json'

import { user } from './service/user'

console.log("Version:", pkg.version)

const apiPort = process.env.API_PORT
const debugLog = process.env.DEBUG_LOG
const fastify = Fastify({ logger: debugLog == 'true' })

fastify.register(user, { prefix: '/' })

fastify.listen({ port: 3000 })
  .then(() => console.log(`api server started on port ${apiPort}`))
  .catch(error => console.error('api server listen error', error))
