import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { DeleteUserRepository } from "../repositories/delete-user";
import { DeleteUserService } from "../services/delete-user";
import { DeleteUserController } from "../controllers/delete-user";
import { GetUserByIdRepository } from "../repositories/get-user-by-id";

export async function deleteUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/api/users/:userId",
    {
      schema: {
        params: z.object({
          userId: z.string().uuid({message: 'Provided userId is not valid'})
        }),
        response: {
          200: z.object({
            data: z.object({
              id: z.string(),
              first_name: z.string(),
              last_name: z.string(),
              email: z.string()
            })
          })
        }
      }
    },
    async(request, reply) => {
      const { userId } = request.params
      
      const deleteUserRepository = new DeleteUserRepository()
      const getUserByIdRepository = new GetUserByIdRepository()

      const deleteUserService = new DeleteUserService(deleteUserRepository, getUserByIdRepository)
      
      const deleteUserController = new DeleteUserController(deleteUserService)

      const deletedUser = await deleteUserController.execute(userId)

      const { password, ...otherProps } = deletedUser;

      return reply.code(200).send({data: otherProps})
    }
  )
}