import { FastifyRequest } from "fastify";
import z from "zod";
import { CreateUserService } from "../services/create-user";
import { User } from "@prisma/client";
import { BadRequest } from "../routes/_errors/bad-request";

export class CreateUserController {
  async execute(createUserParams: Omit<User, "id">) {
    try {
      const { email, first_name, last_name, password } = createUserParams;

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
    } catch (e) {
      console.error(e);

      throw new BadRequest("Error registering user");
    }
  }
}
