import { Transaction } from '@prisma/client'
import {
  CreateTransactionProps,
  ICreateTransactionRepository
} from '../../repositories/transaction/create-transaction'
import { IGetUserByIdRepository } from '../../repositories/user/get-user-by-id'
import { NotFound } from '../../routes/_errors/not-found'

export interface ICreateTransactionService {
  execute(createTransactionParams: CreateTransactionProps): Promise<Transaction>
}

export class CreateTransactionService implements ICreateTransactionRepository {
  constructor(
    private createTransactionRepository: ICreateTransactionRepository,
    private getUserByIdRepository: IGetUserByIdRepository
  ) {}

  async execute(createTransactionParams: CreateTransactionProps) {
    const userId = createTransactionParams.user_id

    const user = await this.getUserByIdRepository.execute(userId)

    if (!user) {
      throw new NotFound('User not found!')
    }

    const transaction = await this.createTransactionRepository.execute(
      createTransactionParams
    )

    return transaction
  }
}
