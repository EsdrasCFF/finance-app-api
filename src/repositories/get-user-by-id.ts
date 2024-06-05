import { db } from "../lib/prisma";

export class GetUserByIdRepository {
  async execute(userId: string) {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    return user;
  }
}
