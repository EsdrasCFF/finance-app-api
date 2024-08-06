import { User } from '@prisma/client'
import { db } from '../../lib/prisma'

export interface ICreateUserRepository {
  execute(createUserParams: Omit<User, 'id'>): Promise<User>
}

export class CreateUserRepository implements ICreateUserRepository {
  async execute(createUserParams: Omit<User, 'id'>) {
    const results = await db.user.create({
      data: createUserParams
    })

    return results
  }
}
