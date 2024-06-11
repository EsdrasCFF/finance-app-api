import { User } from "@prisma/client";
import { db } from "../../lib/prisma";

interface UpdateUserProps {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface IUpdateUserRepository {
  execute(userId: string, updateUserParams: UpdateUserProps): Promise<User>
}

export class UpdateUserRepository implements IUpdateUserRepository {
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
