import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { makeUpdateTransactionController } from "../../factories/controllers/transactions";
import { checkIfAmountIsValid, roundAmountToTwoDecimals } from "../../lib/utils";

const updateTransactionSchema= z.object({
  amount: z.union([z.string(), z.number()])
    .refine((value) => checkIfAmountIsValid(value), 
      {message: 'Provided amount is not valid!'}
    )
    .transform((value) => roundAmountToTwoDecimals(Number(value)))
    .nullable()
    .optional(),
  name: z.string().min(3).nullable().optional(),
  date: z.coerce.date().nullable().optional(),
  description: z.string().nullable().optional(),
  type: z.enum(['INCOME', 'EXPENSE', 'INVESTMENT']).nullable().optional()
}).strict({message: 'Some provided field is not allowed!'})

export async function UpdateTransaction(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch(
    '/api/transactions/:transactionId',
    {
      schema: {
        body: updateTransactionSchema,
        params: z.object({
          transactionId: z.string()
        }),
        response: {
          200: z.object({
            data: z.object({
              amount: z.number(),
              name: z.string(),
              date: z.date(),
              description: z.string().nullable().optional(),
              type: z.string()
            })
          })
        }
      }
    },
    async (request, reply) => {
      const { transactionId } = request.params
      
      const {type, amount, date, description, name} = request.body;

      const updateTransactionController = makeUpdateTransactionController()

      const updateTransactionParams = {
        amount: amount || null,
        name: name || null,
        date: date || null,
        description: description || null,
        type: type || null,
      }

      const transaction = await updateTransactionController.execute(transactionId, updateTransactionParams)

      return reply.code(200).send({
        data: transaction
      })
    }
  )
}