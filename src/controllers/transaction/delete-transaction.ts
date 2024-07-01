import { Transaction} from "@prisma/client";
import validator from "validator";
import { BadRequest } from "../../routes/_errors/bad-request";
import { IDeleteTransactionService } from "../../services/transaction/delete-transaction";

export interface IDeleteTransactionController {
  execute(transactionId: string): Promise<Transaction>
}

export class DeleteTransactionController implements IDeleteTransactionController {
  constructor(private deleteTransactionService: IDeleteTransactionService) {}

  async execute(transactionId: string) {
    const idIsValid = validator.isUUID(transactionId)

    if(!idIsValid) {
      throw new BadRequest('Provided TransactionId is not valid!')
    }

    const deletedTransaction = await this.deleteTransactionService.execute(transactionId)

    return deletedTransaction
  }
}