import { User } from "@prisma/client";
import { db } from "../../lib/prisma";

export interface IGetUserByIdRepository {
  execute(userId: string): Promise<User | null>
}

export class GetUserByIdRepository implements IGetUserByIdRepository {
  async execute(userId: string) {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    return user;
  }
}
