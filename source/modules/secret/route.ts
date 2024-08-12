import { FastifyPluginAsync } from 'fastify'

import * as service from './service'
import { getSignInSecretKey } from '../../utils/sign'
import { checkAuth } from '../../hooks/auth'

type CreatePayload = Pick<service.Secret, 'type' | 'deletedTime' | 'disabledTime'>

export const routes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', checkAuth)

  app.all('/secret/create/:userId', async (request: WithQuery<{ userId: string }, CreatePayload>, reply) => {
    const sk = getSignInSecretKey()
    const data = { userId: request.params.userId, value: sk, ...request.body }
    return service.createSecret(data)
  })

  app.all('/secret/list/:userId', async (request: WithParams<{ userId: string }>, reply) => {
    return service.getSecretListByUserId(request.params.userId)
  })

  app.all('/secret/get/:secretKey', async (request: WithParams<{ secretKey: string }>, reply) => {
    return service.getSecret(request.params.secretKey)
  })

  app.all('/secret/disable/:secretKey', async (request: WithParams<{ secretKey: string }>, reply) => {
    const now = new Date().toISOString()
    return service.updateSecret(request.params.secretKey, { disabledTime: now })
  })

  app.all('/secret/delete/:secretKey', async (request: WithParams<{ secretKey: string }>, reply) => {
    const key = getSignInSecretKey()
    return service.deleteSecret(request.params.secretKey)
  })
}