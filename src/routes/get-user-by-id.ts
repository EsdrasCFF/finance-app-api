import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { GetUserByIdController } from "../controllers/get-user-by-id";
import { GetUserByIdRepository } from "../repositories/get-user-by-id";
import { GetUserByEmailService } from "../services/get-user-by-email";
import { GetUserByIdService } from "../services/get-user-by-id";

export async function getUserById(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/api/users/:userId",
    {
      schema: {
        params: z.object({
          userId: z.string().uuid({ message: "Provider id is not valid!" }),
        }),
        response: {
          200: z.object({
            data: z.object({
              id: z.string().uuid(),
              first_name: z.string(),
              last_name: z.string(),
              email: z.string().email(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { userId } = request.params;

      const getUserByIdRepository = new GetUserByIdRepository()
      const getUserByIdService = new GetUserByIdService(getUserByIdRepository)
      const getUserByIdController = new GetUserByIdController(getUserByIdService);
      
      const user = await getUserByIdController.execute(userId);

      return reply.code(200).send({
        data: user,
      });
    }
  );
}
