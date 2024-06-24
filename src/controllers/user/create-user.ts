import { FastifyRequest } from "fastify";
import z from "zod";
import { User } from "@prisma/client";

import validator from "validator";
import { BadRequest } from "../../routes/_errors/bad-request";
import { ICreateUserService } from "../../services/user/create-user";
import { IGetUserByEmailService } from "../../services/user/get-user-by-email";


interface ICreateUserController {
  execute(createUserParams: Omit<User, "id">): Promise<Omit<User, "password">>;
}

export class CreateUserController implements ICreateUserController {
  constructor(
    private createUserService: ICreateUserService
  ) {}

  async execute(createUserParams: Omit<User, "id">) {
    const { email, first_name, last_name, password } = createUserParams;

    const result = await this.createUserService.execute({
      first_name,
      last_name,
      email,
      password,
    });

    const user = {
      id: result.id,
      first_name: result.first_name,
      last_name: result.last_name,
      email: result.email,
    };

    return user;
  }
}
