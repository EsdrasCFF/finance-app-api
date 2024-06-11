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
    private createUserService: ICreateUserService,
    private getUserByEmailService: IGetUserByEmailService
  ) {}

  async execute(createUserParams: Omit<User, "id">) {
    const { email, first_name, last_name, password } = createUserParams;

    const isValidPassword = password.length > 5;

    if (!isValidPassword) {
      throw new BadRequest(
        "Password must be greater than or equal to 6 characters!"
      );
    }

    const isValidEmail = validator.isEmail(email);

    if (!isValidEmail) {
      throw new BadRequest("Invalid Email. Please provide a valid email");
    }

    const emailIsAlreadyInUse = await this.getUserByEmailService.execute(email);

    if (emailIsAlreadyInUse !== null) {
      throw new BadRequest("This email is already in use");
    }

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
