import { User } from '@prisma/client'
import { db } from '../../lib/prisma'

export interface IGetUserByEmailRepository {
  execute(email: string): Promise<User | null>
}

export class GetUserByEmailRepository implements IGetUserByEmailRepository {
  async execute(email: string) {
    const user = await db.user.findFirst({
      where: {
        email
      }
    })

    return user
  }
}
