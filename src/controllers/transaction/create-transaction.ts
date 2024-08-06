import { Transaction } from "@prisma/client";
import { BadRequest } from "../../routes/_errors/bad-request";
import { ICreateTransactionService } from "../../services/transaction/create-transaction";
import { roundAmountToTwoDecimals } from "../../lib/utils";
import { createTransactionSchema } from "../../routes/transactions/create-transaction";
import { CreateTransactionProps } from "../../repositories/transaction/create-transaction";


interface ICreateTransactionController {
  execute(createTransactionParams: CreateTransactionProps): Promise<Transaction>
}

export class CreateTransactionController implements ICreateTransactionController {
  constructor(private createTransactionService: ICreateTransactionService){}

  async execute(createTransactionParams: CreateTransactionProps) {

    createTransactionSchema.parse(createTransactionParams)

    const {amount, date, description, name, user_id, type} = createTransactionParams

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
      user_id,
    })

    return transaction
  }
}