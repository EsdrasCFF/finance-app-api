import { TRANSACTION_TYPE } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { makeCreateTransactionController } from "../../factories/controllers/transactions";
import { checkIfAmountIsValid } from "../../lib/utils";


export const createTransactionSchema = z.object({
  userId: z.string({required_error: 'UserId is required!'})
    .uuid({message: 'Provided userId is not valid!'}),
  name: z.string({required_error: 'Name is required!'}).trim().min(3),
  description: z.string().nullable().optional(),
  date: z.coerce.date({required_error: 'Date is required!'}),
  amount: z.union([z.number(), z.string()], {required_error: 'Amount is required'})
    .refine((value) => {
      const amountIsValid = checkIfAmountIsValid(value)

      return amountIsValid
    }, {message: 'Provided amount is not valid!'}),
  type: z.enum([
    TRANSACTION_TYPE.EXPENSE,
    TRANSACTION_TYPE.INCOME,
    TRANSACTION_TYPE.INVESTMENT
  ],{message: 'Provided type is invalid. Expected EXPENSE, INCOME or INVESTMENT'})
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