import { faker } from "@faker-js/faker"
import { TRANSACTION_TYPE } from "@prisma/client"
import { IDeleteTransactionRepository } from "../../../../repositories/transaction/delete-transaction"
import { IGetTransactionByIdRepository } from "../../../../repositories/transaction/get-transaction-by-id"
import { NotFound } from "../../../../routes/_errors/not-found"
import { DeleteTransactionService } from "../../../../services/transaction/delete-transaction"

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

  it('Should call GetTransactionByIdRepository', async () => {
    // arrange
    const {sut, getTransactionByIdRepositoryStub} = makeSut()
    
    const executeSpy = jest.spyOn(getTransactionByIdRepositoryStub, 'execute')

    // act
    await sut.execute(transactionIdParams)

    // assert
    expect(executeSpy).toHaveBeenCalled()
  })

  it('Should call GetTransactionByIdRepository with correct params',  async () => {
    // arrange
    const { sut, getTransactionByIdRepositoryStub } = makeSut()
    
    const executeSpy = jest.spyOn(getTransactionByIdRepositoryStub, 'execute')
    
    // act
    await sut.execute(transactionIdParams)

    // assert
    expect(executeSpy).toHaveBeenLastCalledWith(transactionIdParams)
  })

  it('Should throw NotFound instance error if user not found', async () => {
    // arrange
    const {sut, getTransactionByIdRepositoryStub} = makeSut()

    jest.spyOn(getTransactionByIdRepositoryStub, 'execute').mockImplementationOnce(() => null!)

    // act
    const result = sut.execute(transactionIdParams)

    // assert
    await expect(result).rejects.toThrow(NotFound)
  })

  it('Should call DeleteTransactionRepository', async () => {
    // arrange
    const { sut, deleteTransactionRepositoryStub } = makeSut()
    
    const executeSpy = jest.spyOn(deleteTransactionRepositoryStub, 'execute')

    // act
    await sut.execute(transactionIdParams)

    // assert
    expect(executeSpy).toHaveBeenCalledWith(transactionIdParams)
  })
})