import { Transaction } from "@prisma/client";
import { db } from "../../lib/prisma";

export interface ICreateTransactionRepository {
  execute(createTransactionParams: Omit<Transaction, 'id'>): Promise<Transaction>
}

export class CreateTransactionsRepository implements ICreateTransactionRepository {
  async execute(createTransactionParams: Omit<Transaction, 'id'>) {
    const transaction = await db.transaction.create({
      data: createTransactionParams
    })

    return transaction
  }
}