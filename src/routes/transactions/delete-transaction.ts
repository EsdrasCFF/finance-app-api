import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { makeDeleteUserController } from "../../factories/controllers/users";
import { makeDeleteTransactionController } from "../../factories/controllers/transactions";

export async function deleteTransaction(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/api/transactions/:transactionId",
    {
      schema: {
        params: z.object({
          transactionId: z.string().uuid({message: 'Provided transactionId is not valid'})
        }),
        response: {
          200: z.object({
            data: z.object({
              id: z.string(),
              user_id: z.string(),
              description: z.string().nullable(),
              date: z.coerce.date(),
              amount: z.number(),
              type: z.string(),
            })
          })
        }
      }
    },
    async(request, reply) => {
      const { transactionId } = request.params
  
      const deleteTransactionController = makeDeleteTransactionController()

      const deletedUser = await deleteTransactionController.execute(transactionId)

      return reply.code(200).send({data: deletedUser})
    }
  )
}




// id: string;
//     user_id: string;
//     name: string;
//     description: string | null;
//     date: Date;
//     amount: number;
//     type: $Enums.TRANSACTION_TYPE;