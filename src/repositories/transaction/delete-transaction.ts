import { Transaction } from "@prisma/client";
import { db } from "../../lib/prisma";


export interface IDeleteTransactionRepository {
  execute(transactionId: string): Promise<Transaction>
}

export class DeleteUserRepository implements IDeleteTransactionRepository {
  async execute(transactionId: string) {
    const transaction = await db.transaction.delete({
      where: {
        id: transactionId
      }
    })

    return transaction
  }
}