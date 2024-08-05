import { CreateTransactionController } from "../../../../controllers/transaction/create-transaction"
import { DeleteTransactionController } from "../../../../controllers/transaction/delete-transaction"
import { GetTransactionsByUserIdController } from "../../../../controllers/transaction/get-transactions-by-userId"
import { UpdateTransactionController } from "../../../../controllers/transaction/update-transaction"
import { makeCreateTransactionController, makeDeleteTransactionController, makeGetTransactionsByUserIdController, makeUpdateTransactionController } from "../../../../factories/controllers/transactions"

describe('Transaction Controller Factories', () => {
  it('Should return a valid CreateTransactionCotroller instance', () => {
    expect(makeCreateTransactionController()).toBeInstanceOf(CreateTransactionController)
  })

  it('Should return a valid GetTransactionsByUserIdController instance', () => {
    expect(makeGetTransactionsByUserIdController()).toBeInstanceOf(GetTransactionsByUserIdController)
  })

  it('Should return a valid DeleteTransactionController instance', () => {
    expect(makeDeleteTransactionController()).toBeInstanceOf(DeleteTransactionController)
  })

  it('Should return a valid UpdateTransactionController instance', () => {
    expect(makeUpdateTransactionController()).toBeInstanceOf(UpdateTransactionController)
  })
})