import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { makeGetTransactionsByUserIdController } from "../../factories/controllers/transactions";

export async function getTransactions(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/api/transactions", 
    {
      schema: {
        summary: 'Get Transactions',
        tags: ['transacions'],
        querystring: z.object({
          userId: z.string().uuid({message: 'Provided userId is not valid!'})
        }),
      }
    },
    async (request, reply) => {
      const { userId } = request.query

      const getTransactionsByUserId = makeGetTransactionsByUserIdController()

      const transactions = await getTransactionsByUserId.execute(userId)

      return reply.code(200).send({
        data: transactions
      })
    })
}