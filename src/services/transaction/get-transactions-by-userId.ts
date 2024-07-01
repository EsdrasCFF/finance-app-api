import { Transaction } from "@prisma/client";
import { IGetTransactionsByUserIdRepository } from "../../repositories/transaction/get-transactions-by-userId";
import { IGetUserByIdRepository } from "../../repositories/user/get-user-by-id";
import { NotFound } from "../../routes/_errors/not-found";

export interface IGetTransactionsByUserIdService {
  execute(userId: string): Promise<Transaction[]>
}

export class GetTransactionsByUserIdService implements IGetTransactionsByUserIdService{
  
  constructor(
    private getTransactionsByUserIdRepository: IGetTransactionsByUserIdRepository,
    private getUserByIdRepository: IGetUserByIdRepository
    ) {}

  async execute(userId:string) {
    
    const user = await this.getUserByIdRepository.execute(userId)

    if(!user) {
      throw new NotFound('User not found!')
    }

    const transactions = this.getTransactionsByUserIdRepository.execute(userId)
    
    return transactions
  }
}