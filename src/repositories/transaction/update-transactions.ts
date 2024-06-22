import { $Enums } from "@prisma/client";
import { db } from "../../lib/prisma";

interface UpdateTransactionsProps {
  id: string;
  name: string;
  description: string | null;
  date: Date;
  amount: number;
  type: $Enums.TRANSACTION_TYPE
}

export class UpdateTransactionsRepository {
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