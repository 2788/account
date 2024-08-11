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
  const user = await db.user.findFirstOrThrow({ where: { username } })
  if (user.deletedTime == null || new Date(user.deletedTime).getTime() > Date.now()) {
    return user
  }

  throw new Error('User has been deleted')
}

export async function getUserByUserId(id: string) {
  const user = await db.user.findFirstOrThrow({ where: { id } })

  if (user.deletedTime == null || new Date(user.deletedTime).getTime() > Date.now()) {
    return user
  }

  throw new Error('User has been deleted')
}

export function deleteUser(id: string) {
  return db.user.update({ where: { id }, data: { deletedTime: new Date().toISOString() } })
}
