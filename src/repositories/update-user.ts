import { db } from "../lib/prisma";

interface UpdateUserProps {
  first_name: string
  last_name: string
  email: string
  password: string
}

export class UpdateUserRepository {
  async execute(userId: string, updateUserParams: UpdateUserProps) {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) return null;

    
    const updatedUser = await db.user.update({
      data: updateUserParams,
      where: {
        id: userId
      }
    })

    return updatedUser
  }
}
