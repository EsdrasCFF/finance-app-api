import { convertHundredUnitsToAmount } from "../../lib/utils";
import { IGetUserBalanceRepository } from "../../repositories/user/get-user-balance";
import { IGetUserByIdRepository } from "../../repositories/user/get-user-by-id";
import { NotFound } from "../../routes/_errors/not-found";

export interface BalanceParams {
  incomes: number 
  expenses: number 
  investments: number 
  balance: number 
}

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

    const result = await this.getUserBalanceRepository.execute(userId)

    const balance = {
      incomes: convertHundredUnitsToAmount(result.incomes),
      expenses: convertHundredUnitsToAmount(result.expenses),
      investments: convertHundredUnitsToAmount(result.investments),
      balance: convertHundredUnitsToAmount(result.balance),
    }

    return balance
  }
}