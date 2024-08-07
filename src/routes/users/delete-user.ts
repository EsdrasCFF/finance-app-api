import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { makeDeleteUserController } from '../../factories/controllers/users'

export async function deleteUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/api/users/:userId',
    {
      schema: {
        summary: 'Delete user',
        tags: ['users'],
        params: z.object({
          userId: z.string().uuid({ message: 'Provided userId is not valid' })
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
    async (request, reply) => {
      const { userId } = request.params

      const deleteUserController = makeDeleteUserController()

      const deletedUser = await deleteUserController.execute(userId)

      return reply.code(200).send({ data: deletedUser })
    }
  )
}
