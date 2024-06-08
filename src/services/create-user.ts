import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import {
  CreateUserRepository,
  ICreateUserRepository,
} from "../repositories/create-users";

export interface ICreateUserService {
  execute(crateUserParams: Omit<User, "id">): Promise<User>;
}

export class CreateUserService implements ICreateUserService {
  constructor(private createUserRepository: ICreateUserRepository) {}

  async execute(createUserParams: Omit<User, "id">) {
    const hashedPassword = await bcrypt.hash(createUserParams.password, 8);

    const user = {
      ...createUserParams,
      password: hashedPassword,
    };

    const createdUser = await this.createUserRepository.execute(user);

    return createdUser;
  }
}
