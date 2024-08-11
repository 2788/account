import * as crypto from 'crypto'

export interface SignPayload {
  expiredTime: string
  data: {
    secretId: string
    username: string
  }
}

export function signToken(secretKey: string, data: SignPayload): string {
  const dataString = JSON.stringify(data)
  const base64DataString = Buffer.from(dataString).toString('base64')

  const hmac = crypto.createHmac('sha256', secretKey)
  hmac.update(base64DataString);
  const signString = hmac.digest('base64')

  return `${signString}:${base64DataString}`
}

export function getPayload(token: string): SignPayload{
  const tuple = token.split(':')

  if (tuple.length!== 2) {
    throw new Error('Invalid token')
  }

  const [_, base64DataString] = tuple
  const dataString = Buffer.from(base64DataString, 'base64').toString()
  return JSON.parse(dataString)
}

export function verifyToken(token: string, secretKey: string): boolean {
  const tuple = token.split(':')
  if (tuple.length!== 2) return false
  const [signString, base64DataString] = tuple

  const hmac = crypto.createHmac('sha256', secretKey)
  hmac.update(base64DataString);
  const expectedSignString = hmac.digest('base64')

  return signString === expectedSignString
}

export function getSignInSecretKey() {
  return crypto.randomBytes(32).toString('hex')
}
