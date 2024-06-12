import { TRANSACTION_TYPE } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { makeCreateTransactionController } from "../../factories/controllers/transactions";


const createTransactionSchema = z.object({
  userId: z.string().uuid({message: 'Provided userId is not valid!'}),
  name: z.string(),
  description: z.string().nullable().optional(),
  date: z.coerce.date(),
  amount: z.number(),
  type: z.enum([
    TRANSACTION_TYPE.EXPENSE,
    TRANSACTION_TYPE.INCOME,
    TRANSACTION_TYPE.INVESTMENT
  ])
})

export async function createTransaction(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>()
  .post(
    '/api/transactions', 
    {
      schema: {
        body: createTransactionSchema,
        response: {
          201: z.object({
            data: z.object({
              id: z.string(),
              user_id: z.string(),
              name: z.string(),
              description: z.string().nullable(),
              date: z.date(),
              amount: z.number(),
              type: z.string()
            })

          })
        }
      },
    }, 
    async (request, reply) => {
      const { amount, date, name, type, userId, description } = request.body

      const createTransactionController = makeCreateTransactionController()

      const transaction = await createTransactionController.execute({
        amount,
        date,
        name,
        type,
        userId,
        description: description || null
      })

      return reply.code(201).send({data: transaction})
    })
}