import { db } from '../../utils/db'

export interface Account {
  username: string
  password: string
}

export async function createUser(account: Account) {
  const data = {
    ...account,
    createdTime: new Date().toISOString(),
    updatedTime: new Date().toISOString()
  }

  return db.user.create({ data })
}

export async function getUserByUsername(username: string) {
  return db.user.findFirstOrThrow({
    where: {
      username,
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

export async function getUserByUserId(id: string) {
  return db.user.findFirstOrThrow({
    where: {
      OR: [
        {
          deletedTime: { equals: null }
        },
        {
          deletedTime: { not: null, gt: new Date() }
        },
      ],
      id
    }
  })
}

export function deleteUser(id: string) {
  return db.user.update({ where: { id }, data: { deletedTime: new Date().toISOString() } })
}
