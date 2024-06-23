import { BalanceParams, IGetUserBalanceRepository } from "../../repositories/user/get-user-balance";
import { IGetUserByIdRepository } from "../../repositories/user/get-user-by-id";
import { NotFound } from "../../routes/_errors/not-found";

export interface IGetUserBalanceService {
  execute(userId: string): Promise<BalanceParams>
}

export class GetUserBalanceService implements IGetUserBalanceService {
  constructor(
    private getUserBalanceRepository: IGetUserBalanceRepository,
    private getUserByIdRepository: IGetUserByIdRepository,
  ) {}
  
  async execute(userId: string) {
    const userExists = await this.getUserByIdRepository.execute(userId)

    if(!userExists) {
      throw new NotFound('User not found!')
    }

    const balance = await this.getUserBalanceRepository.execute(userId)

    return balance
  }
}