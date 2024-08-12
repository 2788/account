import { db } from "../../utils/db"

type SecretType = 'SignIn' | 'System' | 'User'

export interface Secret {
  id: string
  key: string
  type: SecretType
  value: string
  userId: string
  createdTime?: string
  deletedTime?: string
  disabledTime?: string
}


export function createSecret(sk: Pick<Secret, 'value' | 'type' | 'userId' | 'deletedTime'>) {
  return db.secret.create({ data: sk })
}

export async function getSecretListByUserId(userId: string) {
  return db.secret.findMany({
    where: {
      userId,
      OR: [
        {
          deletedTime: { equals: null }
        },
        {
          deletedTime: { not: null, gt: new Date() }
        },
      ],
    }
  })
}

export async function getSecret(key: string) {
  return db.secret.findFirstOrThrow({
    where: {
      key,
      OR: [
        {
          deletedTime: { equals: null }
        },
        {
          deletedTime: { not: null, gt: new Date() }
        },
      ],
    }
  })
}

export async function updateSecret(key: string, data: Partial<Secret>) {
  const secret = await getSecret(key)
  db.secret.update({
    where: { id: secret.id },
    data: { ...data }
  })
}

export function deleteSecret(key: string) {
  return updateSecret(key, { deletedTime: new Date().toISOString() })
}

export function deleteSecretList(keys: string[]) {
  return db.secret.updateMany({
    where: {
      key: {
        in: keys,
      }
    },
    data: {
      deletedTime: new Date().toISOString()
    }
  })
}

export function deleteSecretListBy(secret: Partial<Secret>) {
  return db.secret.updateMany({
    where: {
      ...secret,
      deletedTime: null
    },
    data: {
      deletedTime: new Date().toISOString()
    }
  })
}
