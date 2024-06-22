import { $Enums, Transaction } from "@prisma/client";
import validator from "validator";
import { BadRequest } from "../../routes/_errors/bad-request";
import { checkIfAmountIsValid, roundAmountToTwoDecimals } from "../../lib/utils";
import { IUpdateTransactionService } from "../../services/transaction/update-transaction";

export interface UpdateTransactionProps {
  name: string | null
  description: string | null;
  date: Date | null
  amount: number | string | null
  type: $Enums.TRANSACTION_TYPE | null  
}

interface IUpdateTransactionController {
  execute(transactionId: string, updateTransactionParams: UpdateTransactionProps): Promise<Transaction>
}

export class UpdateTransactionController implements IUpdateTransactionController{
  constructor(
    private updateTransactionService: IUpdateTransactionService
  ) {}

  async execute(transactionId: string, updateTransactionParams: UpdateTransactionProps) {
    const { amount, date, description, name, type }  = updateTransactionParams

    const IdIsValid = validator.isUUID(transactionId)

    if(!IdIsValid) {
      throw new BadRequest('Provided transactionId is not valid!')
    }

    const allowedFields = [
      'name',
      'description',
      'date',
      'amount',
      'type'
    ]

    const someFiledIsNotValid = Object.keys(updateTransactionParams).some((field) => !allowedFields.includes(field))

    if(someFiledIsNotValid) {
      throw new BadRequest('Some provided field is not allowed!')
    }

    let newAmount = null
    let newDate = null
    let newType = null;

    if(amount) {
      const amoutIsValid = checkIfAmountIsValid(amount)

      if(!amoutIsValid) {
        throw new BadRequest('Provided amount is not valid!')
      }
      
      newAmount = roundAmountToTwoDecimals(Number(amount)) * 100
    }

    if(date) {
      // const dateIsValid = validator.isDataURI(date)

      // if(!dateIsValid) {
      //   throw new BadRequest('Provided date is not valid!')
      // }

      // console.log({date})

      newDate = date
    }


    if(type) {
      const typeIsValid = ['INCOME', 'EXPENSE', 'INVESTMENT'].includes(type.toUpperCase().trim())

      if(!typeIsValid) {
        throw new BadRequest('Provided type is not valid!')
      }

      newType = type
    }


    const updateTransactionProps = {
      amount: newAmount,
      date: newDate,
      description: description,
      name: name,
      type: newType,
    }
  
    const transaction = await this.updateTransactionService.execute(transactionId, updateTransactionProps)

    return transaction
  }
}