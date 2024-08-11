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
  const list = await db.secret.findMany({ where: { userId } })
  return list.filter(s => s.deletedTime == null || new Date(s.deletedTime).getTime() > Date.now())
}

export async function getSecret(key: string) {
  const secret = await db.secret.findFirstOrThrow({ where: { key } })
  if (secret.deletedTime == null || new Date(secret.deletedTime).getTime() > Date.now()) {
    return secret
  }

  throw new Error('Secret not found or expired')
}

export async function updateSecret(key: string, data: Partial<Secret>) {
  const secret = await getSecret(key)
  db.secret.update({
    where: { id: secret.id },
    data: {
     ...data,
      updatedTime: new Date().toISOString()
    }
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
