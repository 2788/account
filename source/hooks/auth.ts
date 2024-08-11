import { FastifyReply, FastifyRequest } from 'fastify'

import { service as secretService } from '../modules/secret'
import { service as userService } from '../modules/user'

import { getPayload, verifyToken } from '../utils/sign'

function getTokenFromHeader(authorization: string | undefined,): string | null {
  if (!authorization) return null
  const token = authorization.replace('Bearer ', '')
  return token || null
}

export const checkAuth = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const token = getTokenFromHeader(request.headers.authorization)
  if (!token) {
    return reply
      .code(401)
      .send('unauthorized')
  }

  const payload = getPayload(token)

  try {
    const secret = await secretService.getSecret(payload.data.secretId)
    const user = await userService.getUserByUserId(secret.userId)

    if (!verifyToken(token, secret.key)) {
      return reply
        .code(401)
        .send('unauthorized')
    }
  } catch (error) {
    return reply
      .code(401)
      .send('unauthorized')
  }
}