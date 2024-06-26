import { TRANSACTION_TYPE, Transaction } from "@prisma/client";
import validator from "validator";
import { BadRequest } from "../../routes/_errors/bad-request";
import { ICreateTransactionService } from "../../services/transaction/create-transaction";
import { checkIfAmountIsValid, roundAmountToTwoDecimals } from "../../lib/utils";
import { createTransactionSchema } from "../../routes/transactions/create-transaction";

interface CreateTransactionParams {
  amount: number | string;
  date: Date;
  description: string | null;
  name: string;
  type: TRANSACTION_TYPE,
  userId: string;
}

interface ICreateTransactionController {
  execute(createTransactionParams: CreateTransactionParams): Promise<Transaction>
}

export class CreateTransactionController implements ICreateTransactionController {
  constructor(private createTransactionService: ICreateTransactionService){}

  async execute(createTransactionParams: CreateTransactionParams) {

    createTransactionSchema.parse(createTransactionParams)

    const {amount, date, description, name, userId, type} = createTransactionParams

    const newAmount = roundAmountToTwoDecimals(Number(amount)) * 100

    if(newAmount <= 0) {
      throw new BadRequest('Amount must be greater than 0.')
    }

    const transaction = await this.createTransactionService.execute({
      amount: newAmount,
      date,
      description,
      name,
      type,
      user_id: userId
    })

    return transaction
  }
}