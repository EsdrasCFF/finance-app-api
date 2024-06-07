import { db } from "../lib/prisma";

export class GetUserByEmailRepository {
  async execute(email: string) {
    const user = await db.user.findFirst({
      where: {
        email,
      },
    });

    return user;
  }
}
