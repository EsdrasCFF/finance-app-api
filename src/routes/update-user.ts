import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { UpdateUserController } from "../controllers/update-user";
import { UpdateUserRepository } from "../repositories/update-user";
import { UpdateUserService } from "../services/update-user";
import { GetUserByIdRepository } from "../repositories/get-user-by-id";
import { GetUserByEmailRepository } from "../repositories/get-user-by-email";

const updatedUserSchema = z.object({
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  password: z
    .string()
    .min(6, { message: "Password must be greater or equal 6 characters" })
    .optional(),
  old_password: z.string().nullable().optional(),
});

export async function updateUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch(
    "/api/users/:userId",
    {
      schema: {
        params: z.object({
          userId: z.string().uuid({ message: "Userid provided is not valid" }),
        }),
        body: updatedUserSchema,
        response: {
          200: z.object({
            data: z.object({
              id: z.string(),
              first_name: z.string(),
              last_name: z.string(),
              email: z.string(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { first_name, last_name, email, password, old_password } = request.body;
      const { userId } = request.params;

      const updateUserRepository = new UpdateUserRepository()
      const getUserByIdRepository = new GetUserByIdRepository()
      const getUserByEmailRepository = new GetUserByEmailRepository()

      const updateUserService = new UpdateUserService(getUserByIdRepository, getUserByEmailRepository,updateUserRepository)

      const updateUserController = new UpdateUserController(updateUserService);
      const user = await updateUserController.execute(userId, {
        first_name: first_name || null,
        last_name: last_name || null,
        email: email || null,
        password: password || null,
        old_password: old_password || null,
      });

      return reply.code(200).send({ data: user });
    }
  );
}
