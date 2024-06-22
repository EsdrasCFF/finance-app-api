import { Transaction } from "@prisma/client";
import { IUpdateTransactioRepository, UpdateTransactionsProps } from "../../repositories/transaction/update-transactions";
import { IGetUserByIdRepository } from "../../repositories/user/get-user-by-id";
import { BadRequest } from "../../routes/_errors/bad-request";
import { NotFound } from "../../routes/_errors/not-found";

interface IUpdateTransactionService {
  execute(userId: string, updateTransactionProps: UpdateTransactionsProps): Promise<Transaction>
}

export class UpdateTransactionService implements IUpdateTransactionService{
  constructor(
    private updateUserTransactionRepository: IUpdateTransactioRepository,
    private getUserByIdRepository: IGetUserByIdRepository,  
  ) {}

  async execute(userId: string, updateTransactionProps: UpdateTransactionsProps) {
    const user = await this.getUserByIdRepository.execute(userId)

    if(!user) {
      throw new NotFound('User Not Found!')
    }

    const transaction = await this.updateUserTransactionRepository.execute(user.id, updateTransactionProps)

    return transaction
  }
}