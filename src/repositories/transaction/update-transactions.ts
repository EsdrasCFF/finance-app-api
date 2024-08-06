import { $Enums, Transaction } from '@prisma/client'
import { db } from '../../lib/prisma'

export interface UpdateTransactionsProps {
  name: string
  description: string | null
  date: Date
  amount: number
  type: $Enums.TRANSACTION_TYPE
}

export interface IUpdateTransactioRepository {
  execute(
    transactionId: string,
    updateTransactionParams: UpdateTransactionsProps
  ): Promise<Transaction>
}

export class UpdateTransactionRepository
  implements IUpdateTransactioRepository
{
  async execute(
    transactionId: string,
    updateTransactionParams: UpdateTransactionsProps
  ) {
    const transactionUpdated = await db.transaction.update({
      where: {
        id: transactionId
      },
      data: updateTransactionParams
    })

    return transactionUpdated
  }
}
