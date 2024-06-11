import { User } from "@prisma/client";
import { db } from "../../lib/prisma";


export interface IDeleteUserRepository {
  execute(userId: string): Promise<User>
}

export class DeleteUserRepository implements IDeleteUserRepository {
  async execute(userId: string) {
    const user = await db.user.delete({
      where: {
        id: userId
      }
    })

    return user
  }
}