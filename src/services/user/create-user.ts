import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { ICreateUserRepository } from "../../repositories/user/create-users";
import { IGetUserByEmailRepository } from "../../repositories/user/get-user-by-email";
import { BadRequest } from "../../routes/_errors/bad-request";

export interface ICreateUserService {
  execute(crateUserParams: Omit<User, "id">): Promise<User>;
}

export class CreateUserService implements ICreateUserService {
  constructor(
    private createUserRepository: ICreateUserRepository,
    private getUserByEmailRepositoty: IGetUserByEmailRepository,
  ) {}

  async execute(createUserParams: Omit<User, "id">) {
    
    const emailAlreadyInUse = await this.getUserByEmailRepositoty.execute(createUserParams.email)
    
    if(emailAlreadyInUse) {
      throw new BadRequest('Email already in use!')
    }

    const hashedPassword = await bcrypt.hash(createUserParams.password, 8);

    const user = {
      ...createUserParams,
      password: hashedPassword,
    };

    const createdUser = await this.createUserRepository.execute(user);

    return createdUser;
  }
}
