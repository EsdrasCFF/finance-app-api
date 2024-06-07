import { db } from "../lib/prisma";

interface UpdateUserProps {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export class UpdateUserRepository {
  async execute(userId: string, updateUserParams: UpdateUserProps) {
    const updatedUser = await db.user.update({
      data: updateUserParams,
      where: {
        id: userId,
      },
    });

    return updatedUser;
  }
}
