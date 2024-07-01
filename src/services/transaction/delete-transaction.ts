import { Transaction } from "@prisma/client";
import { NotFound } from "../../routes/_errors/not-found";
import { IGetTransactionByIdRepository } from "../../repositories/transaction/get-transaction-by-id";
import { IDeleteTransactionRepository } from "../../repositories/transaction/delete-transaction";

export interface IDeleteTransactionService {
  execute(transactionId: string): Promise<Transaction>
}

export class DeleteTransactionService implements IDeleteTransactionService {

  constructor(
    private deleteTransactionRepository: IDeleteTransactionRepository,
    private getTransactionByIdRepository: IGetTransactionByIdRepository
  ) {}

  async execute(transactionId: string) {

    const transactionExists = await this.getTransactionByIdRepository.execute(transactionId)

    if(!transactionExists) {
      throw new NotFound('Transaction not found!')
    }

    const deletedTransaction = await this.deleteTransactionRepository.execute(transactionExists.id)

    return deletedTransaction
  }
}