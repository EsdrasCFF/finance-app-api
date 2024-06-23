import validator from "validator";
import { IGetUserBalanceService } from "../../services/user/get-user-balance";
import { BadRequest } from "../../routes/_errors/bad-request";
import { BalanceParams } from "../../repositories/user/get-user-balance";

export interface IGetUserBalanceController {
  execute(userId: string): Promise<BalanceParams>
}

export class GetUserBalanceController implements IGetUserBalanceController {
  constructor(
    private getUserBalanceService: IGetUserBalanceService
  ) {}

  async execute(userId: string) {

    if(!userId) {
      throw new BadRequest('UserId params is missing!')
    }

    const userIdIsValid = validator.isUUID(userId)
  
    if(!userIdIsValid) {
      throw new BadRequest('Provided userId is not valid!')
    }

    const balance = await this.getUserBalanceService.execute(userId)

    return balance
  }
}