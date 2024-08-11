import { FastifyPluginAsync, FastifyRequest } from 'fastify'

import { getPayload, getSignInSecretKey, signToken, verifyToken } from '../../utils/sign'
import { checkAuth } from '../../hooks/auth'
import { service as secretService } from '../secret'

import * as service from './service'

interface Account {
  username: string
  password: string
}

export const routes: FastifyPluginAsync = async (app) => {
  // sign up
  app.post('/sign-up', async (request: WithBody<Account>, reply) => {    
    return service.createUser(request.body)
  })

  app.post('/sign-in', async (request: WithBody<Account>, reply) => {
    const user = await service.getUserByUsername(request.body.username)

    if (user.password !== request.body.password) {
      return { message: 'Invalid username or password' }
    }

    const list = await secretService.getSecretListByUserId(user.id)

    const signInList = list.filter(s => s.type === 'SignIn')
    if (signInList.length > 0) {
      await secretService.deleteSecretList(signInList.map(s => s.key))
    }

    const sk = getSignInSecretKey()
    const expiredTime = new Date(new Date().getTime() + 1000 * 3600* 24 * 30).toISOString() // 30 days
    const secret = await secretService.createSecret({ userId: user.id, type: 'SignIn', value: sk, deletedTime: expiredTime })
    const token = signToken(sk, { expiredTime, data: { secretId: secret.key, username: user.username } })

    return token
  })

  app.register(async (newApp) => {
    newApp.addHook('preHandler', checkAuth)

    newApp.post('/sign-out', async (request: WithParams<{ token: string }>, reply) => {
      const payload = getPayload(request.params.token)
      const sk = await secretService.getSecret(payload.data.secretId)
      if (!verifyToken(request.params.token, sk.key)) {
        await secretService.deleteSecret(sk.key)
      }
      return
    })
  
    newApp.post('/verify-token/:token', async (request: WithParams<{ token: string }>, reply) => {
      const payload = getPayload(request.params.token)
      const sk = await secretService.getSecret(payload.data.secretId)
      return verifyToken(request.params.token, sk.key)
    })
  
    newApp.post('/users/query/:id', async (request: WithParams<{ id: string }>, reply) => {
      const user = await service.getUserByUserId(request.params.id)
      return user
    })
  
    newApp.post('/users/delete/:id', async (request: WithParams<{ id: string }>, reply) => {
      const user = await service.deleteUser(request.params.id)
      if (!user) {
        reply.code(404)
        return { message: 'User not found' }
      }
      return { message: 'User deleted' }
    })
  })
}