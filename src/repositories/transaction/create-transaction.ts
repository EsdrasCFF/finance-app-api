import { TRANSACTION_TYPE, Transaction } from '@prisma/client'
import { db } from '../../lib/prisma'

export type CreateTransactionProps = {
  user_id: string
  name: string
  description: string | null
  date: Date
  amount: number
  type: TRANSACTION_TYPE
}

export interface ICreateTransactionRepository {
  execute(createTransactionParams: CreateTransactionProps): Promise<Transaction>
}

export class CreateTransactionRepository
  implements ICreateTransactionRepository
{
  async execute(createTransactionParams: CreateTransactionProps) {
    const transaction = await db.transaction.create({
      data: createTransactionParams
    })

    return transaction
  }
}
