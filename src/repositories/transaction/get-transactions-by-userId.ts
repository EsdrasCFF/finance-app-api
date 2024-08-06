import { Transaction } from '@prisma/client'
import { db } from '../../lib/prisma'

export interface IGetTransactionsByUserIdRepository {
  execute(userId: string): Promise<Transaction[]>
}

export class GetTransactionsByUserIdRepository
  implements IGetTransactionsByUserIdRepository
{
  async execute(userId: string) {
    const transactions = await db.transaction.findMany({
      where: {
        user_id: userId
      }
    })

    return transactions
  }
}
