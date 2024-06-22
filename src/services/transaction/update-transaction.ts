import { Transaction } from "@prisma/client";
import { IUpdateTransactioRepository, UpdateTransactionsProps } from "../../repositories/transaction/update-transactions";
import { IGetUserByIdRepository } from "../../repositories/user/get-user-by-id";
import { BadRequest } from "../../routes/_errors/bad-request";
import { NotFound } from "../../routes/_errors/not-found";

interface IUpdateTransactionService {
  execute(transactionId: string, updateTransactionProps: UpdateTransactionsProps): Promise<Transaction>
}

export class UpdateTransactionService implements IUpdateTransactionService{
  constructor(
    private updateUserTransactionRepository: IUpdateTransactioRepository 
  ) {}

  async execute(transactionId: string, updateTransactionProps: UpdateTransactionsProps) {

    const transaction = await this.updateUserTransactionRepository.execute(transactionId, updateTransactionProps)

    return transaction
  }
}