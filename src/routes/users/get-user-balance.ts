import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z, { number } from "zod";
import { makeGetUserBalanceController } from "../../factories/controllers/users";

export async function getUserBalance(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/api/users/:userId/balance',
    {
      schema: {
        params: z.object({
          userId: z.string()
        }),
        response: {
          200: z.object({
            data: z.object({
              incomes: z.number(),
              expenses: z.number(),
              investments: z.number(),
              balance: z.number() 
            })
          })
        }
      }
    },
    async (request, reply) => {
      const { userId } = request.params
    
      const getUserBalanceController = makeGetUserBalanceController()
      
      const balance = await getUserBalanceController.execute(userId)

      return reply.code(200).send({
        data: balance
      })
    }
  )
}