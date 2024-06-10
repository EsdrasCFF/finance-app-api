import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { CreateUserController } from "../controllers/create-user";
import { CreateUserRepository } from "../repositories/create-users";
import { CreateUserService } from "../services/create-user";
import { GetUserByEmailService } from "../services/get-user-by-email";
import { GetUserByEmailRepository } from "../repositories/get-user-by-email";
import { makeCreateUserController } from "../factories/controllers/users";

export const createUserSchema = z.object({
  first_name: z.string().trim(),
  last_name: z.string().trim(),
  email: z
    .string()
    .email({ message: "Invalid e-mail. Please provide a valid e-mail" }),
  password: z
    .string()
    .min(6, { message: "Password must be greater or equal 6 characters" }),
});

export async function createUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/api/users",
    {
      schema: {
        body: createUserSchema,
        response: {
          201: z.object({
            data: z.object({
              id: z.string().uuid(),
              first_name: z.string(),
              last_name: z.string(),
              email: z.string(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const createUserParams = request.body;

      const createUserController = makeCreateUserController()

      const result = await createUserController.execute(createUserParams);

      return reply.code(201).send({
        data: result,
      });
    }
  );
}
