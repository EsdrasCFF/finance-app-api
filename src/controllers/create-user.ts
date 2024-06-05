import { FastifyRequest } from "fastify";
import z from "zod";
import { CreateUserService } from "../services/create-user";
import { User } from "@prisma/client";
import { BadRequest } from "../routes/_errors/bad-request";
import validator from "validator";
import { GetUserByEmailService } from "../services/get-user-by-email";
import { ServerError } from "../routes/_errors/server-error";

export class CreateUserController {
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

    const getUserByEmailService = new GetUserByEmailService();
    const emailIsAlreadyInUse = await getUserByEmailService.execute(email);

    if (emailIsAlreadyInUse !== null) {
      throw new BadRequest("This email is already in use");
    }

    const createUserService = new CreateUserService();

    const result = await createUserService.execute({
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
