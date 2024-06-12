import { TRANSACTION_TYPE, Transaction } from "@prisma/client";
import validator from "validator";
import { BadRequest } from "../../routes/_errors/bad-request";
import { ICreateTransactionService } from "../../services/transaction/create-transaction";

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
    const {amount, date, description, name, userId, type} = createTransactionParams

    const userIdIsValid = validator.isUUID(userId)

    if(!userIdIsValid) {
      throw new BadRequest('Provided UserId is not valid!')
    }

    // const amountIsNumber = validator.isCurrency(String(amount), {
    //   digits_after_decimal:[2],
    //   decimal_separator: '.',
    //   allow_negatives: false
    // })

    // if(!amountIsNumber) {
    //   throw new BadRequest('Provided amount is not a valid number')
    // }

    const newAmount = Number(amount) * 100

    if(newAmount <= 0) {
      throw new BadRequest('Amount must be greater than 0.')
    }

    const typeIsValid = ['INCOME', 'EXPENSE', 'INVESTMENT'].includes(type.toUpperCase().trim())

    if(!typeIsValid) {
      throw new BadRequest('Provided type is not valid!')
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