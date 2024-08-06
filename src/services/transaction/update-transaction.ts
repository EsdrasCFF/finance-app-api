import { $Enums, Transaction } from "@prisma/client";
import { IUpdateTransactioRepository } from "../../repositories/transaction/update-transactions";
import { NotFound } from "../../routes/_errors/not-found";
import { IGetTransactionByIdRepository } from "../../repositories/transaction/get-transaction-by-id";
import { convertHundredUnitsToAmount } from "../../lib/utils";

export interface UpdateTransactionProps {
  name: string | null
  description: string | null;
  date: Date | null
  amount: number | null
  type: $Enums.TRANSACTION_TYPE | null  
}


export interface IUpdateTransactionService {
  execute(transactionId: string, updateTransactionProps: UpdateTransactionProps): Promise<Transaction>
}

export class UpdateTransactionService implements IUpdateTransactionService{
  constructor(
    private updateTransactionRepository: IUpdateTransactioRepository,
    private getTransactionById: IGetTransactionByIdRepository,
  ) {}

  async execute(transactionId: string, updateTransactionProps: UpdateTransactionProps) {

    const { amount, date, description, name, type } = updateTransactionProps

    const oldTransaction = await this.getTransactionById.execute(transactionId)

    if(!oldTransaction) {
      throw new NotFound('Transaction not found!')
    }

    const newTransaction = {
      amount: amount || oldTransaction.amount,
      date: date || oldTransaction.date,
      description: description || oldTransaction.description,
      name: name || oldTransaction.name,
      type: type || oldTransaction.type,
    }

    const transaction = await this.updateTransactionRepository.execute(transactionId, newTransaction)

    return {
      ...transaction,
      amount: convertHundredUnitsToAmount(transaction.amount)
    }
  }
}