import { $Enums, Transaction } from "@prisma/client";
import validator from "validator";
import { BadRequest } from "../../routes/_errors/bad-request";
import { IUpdateTransactionService } from "../../services/transaction/update-transaction";
import { updateTransactionSchema } from "../../routes/transactions/update-transaction";

export interface UpdateTransactionProps {
  name: string | null
  description: string | null;
  date: Date | null
  amount: number | null
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
    updateTransactionSchema.parse(updateTransactionParams)
    
    const { amount, date, description, name, type }  = updateTransactionParams

    const IdIsValid = validator.isUUID(transactionId)

    if(!IdIsValid) {
      throw new BadRequest('Provided transactionId is not valid!')
    }

    let newAmount = null
    let newDate = null
    let newType = null;

    if(amount) {
      newAmount = amount * 100
    }

    if(date) {
      newDate = date
    }

    if(type) {
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