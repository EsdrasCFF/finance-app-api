import { Transaction } from '@prisma/client'
import { db } from '../../lib/prisma'

export interface IGetTransactionByIdRepository {
  execute(transactionId: string): Promise<Transaction | null>
}

export class GetTransactionByIdRepository
  implements IGetTransactionByIdRepository
{
  async execute(transactionId: string) {
    const transaction = await db.transaction.findUnique({
      where: {
        id: transactionId
      }
    })

    return transaction
  }
}
