import { User } from "@prisma/client";
import { db } from "../lib/prisma";

export class CreateUserRepository {
  async execute(createUserParams: Omit<User, "id">) {
    const results = await db.user.create({
      data: createUserParams,
    });

    return results;
  }
}
