import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { CreateUserRepository } from "../repositories/create-users";

export class CreateUserService {
  async execute(crateUserParams: Omit<User, "id">) {
    // Check if email is already in use

    const hashedPassword = await bcrypt.hash(crateUserParams.password, 8);

    const user = {
      ...crateUserParams,
      password: hashedPassword,
    };

    const createUserRepository = new CreateUserRepository();

    const createdUser = await createUserRepository.execute(user);

    return createdUser;
  }
}
