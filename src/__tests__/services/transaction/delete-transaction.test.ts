import { faker } from "@faker-js/faker"
import { IDeleteTransactionRepository } from "../../../repositories/transaction/delete-transaction"
import { DeleteTransactionService } from "../../../services/transaction/delete-transaction"
import { TRANSACTION_TYPE } from "@prisma/client"
import { IGetTransactionsByUserIdRepository } from "../../../repositories/transaction/get-transactions-by-userId"
import { IGetTransactionByIdRepository } from "../../../repositories/transaction/get-transaction-by-id"

describe('DeleteTransactionService', () => {
  const transactionIdParams = faker.string.uuid()
  const userId = faker.string.uuid()

  const transactionData = {
    name: faker.person.firstName(),
    description: faker.commerce.productDescription(),
    amount: faker.number.float({min: 100, max: 500}),
    date: faker.date.recent(),
    type: 'INCOME' as TRANSACTION_TYPE,
    user_id: userId

  }

  class GetTransactionByIdRepositoryStub implements IGetTransactionByIdRepository {
    async execute(transactionId: string) {
      return {
        ...transactionData,
        id: transactionId
      }
    }
  }

  class DeleteTransactionRepositoryStub implements IDeleteTransactionRepository {
    async execute(transactionId: string) {
      return {
        ...transactionData,
        id: transactionId
      }
    }
  }

  const makeSut = () => {
    const deleteTransactionRepositoryStub = new DeleteTransactionRepositoryStub()
    const getTransactionByIdRepositoryStub = new GetTransactionByIdRepositoryStub()

    const sut = new DeleteTransactionService(deleteTransactionRepositoryStub, getTransactionByIdRepositoryStub)

    return {sut, deleteTransactionRepositoryStub, getTransactionByIdRepositoryStub}
  }

  it('Should return Transaction Data deleted', async () => {
    // arrange
    const {sut} = makeSut()

    // act
    const result = await sut.execute(transactionIdParams)

    // assert
    expect(result).toBeTruthy()
    expect(result.user_id).toEqual(transactionData.user_id)
  })
})