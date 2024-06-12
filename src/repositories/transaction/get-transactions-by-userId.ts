import { Transaction } from "@prisma/client";
import { db } from "../../lib/prisma";

interface IGetTransactionsByUserId {
  execute(userId: string): Promise<Transaction[]>
}

export class GetTransactionsByUserId implements IGetTransactionsByUserId {
  async execute(userId: string) {
    const transactions = await db.transaction.findMany({
      where: {
        user_id: userId
      }
    })

    return transactions
  }
}