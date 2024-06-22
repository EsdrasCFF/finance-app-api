import { $Enums, Transaction } from "@prisma/client";
import { db } from "../../lib/prisma";

export interface UpdateTransactionsProps {
  id: string;
  name: string;
  description: string | null;
  date: Date;
  amount: number;
  type: $Enums.TRANSACTION_TYPE
}

export interface IUpdateTransactioRepository {
  execute(userId: string, updateTransactionParams: UpdateTransactionsProps): Promise<Transaction>
}

export class UpdateTransactionRepository implements IUpdateTransactioRepository{
  async execute(userId: string, updateTransactionParams: UpdateTransactionsProps) {
    const { id, ...otherProps } = updateTransactionParams
    
    const transactionUpdated = await db.transaction.update({
      where: {
        id,
      },
      data: otherProps
    })

    return transactionUpdated
  }
}