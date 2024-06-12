import validator from "validator";
import { BadRequest } from "../../routes/_errors/bad-request";
import { IGetTransactionsByUserIdService } from "../../services/transaction/get-transactions-by-userId";
import { Transaction } from "@prisma/client";

interface IGetTransactionsByUserIdController {
  execute(userId: string | null | undefined): Promise<Transaction[]>
}

export class GetTransactionsByUserIdController implements IGetTransactionsByUserIdController {

  constructor(private getTransactionsyUserIdService: IGetTransactionsByUserIdService) {}

  async execute(userId:string | null | undefined) {

    if(!userId) {
      throw new BadRequest('UserId is required')
    }

    const userIdIsValid = validator.isUUID(userId)

    if(!userIdIsValid) {
      throw new BadRequest('Provided UserId is not valid!')
    }

    const transactions = await this.getTransactionsyUserIdService.execute(userId)

    return transactions
  }
}