import { faker } from "@faker-js/faker"
import { TRANSACTION_TYPE } from "@prisma/client"
import { IGetTransactionByIdRepository } from "../../../../repositories/transaction/get-transaction-by-id"
import { IUpdateTransactioRepository } from "../../../../repositories/transaction/update-transactions"
import { NotFound } from "../../../../routes/_errors/not-found"
import { UpdateTransactionProps, UpdateTransactionService } from "../../../../services/transaction/update-transaction"


describe('UpdateTransactionService', () => {
  
  const transactionIdParams = faker.string.uuid()
  const userIdParams = faker.string.uuid()

  const updateTransactionParams = {
    name: null,
    description: null,
    date: null,
    amount: null,
    type: null
  }

  class UpdateTransactionRepositoryStub implements IUpdateTransactioRepository {
    async execute(transactionId: string, updateTransactionParams: UpdateTransactionProps) {
      
      const transactionData = {
        name: updateTransactionParams.name || faker.commerce.productName(),
        description: updateTransactionParams.description || faker.commerce.productDescription(),
        date: updateTransactionParams.date || faker.date.recent(),
        amount: updateTransactionParams.amount || faker.number.float({min: 50.50, max: 150.80}),
        type: updateTransactionParams.type || 'EXPENSE' as TRANSACTION_TYPE,
        user_id: userIdParams
      }
      
      return {
        ...transactionData,
        id: transactionId
      }
    }
  }
  
  class GetTransactionByIdRepositoryStub implements IGetTransactionByIdRepository {
    async execute(transactionId: string) {
      
      const transactionData = {
        id: transactionId,
        name: updateTransactionParams.name || faker.commerce.productName(),
        description: updateTransactionParams.description || faker.commerce.productDescription(),
        date: updateTransactionParams.date || faker.date.recent(),
        amount: updateTransactionParams.amount || faker.number.float({min: 50.50, max: 150.80}),
        type: updateTransactionParams.type || 'EXPENSE' as TRANSACTION_TYPE,
        user_id: userIdParams
      }
      
      return transactionData
    }
  }

  const makeSut = () => {
    const udpateTransactionRepositoryStub = new UpdateTransactionRepositoryStub()
    const getTransactionByIdRepositoryStub = new GetTransactionByIdRepositoryStub()

    const sut = new UpdateTransactionService(udpateTransactionRepositoryStub, getTransactionByIdRepositoryStub)
  
    return {
      sut,
      udpateTransactionRepositoryStub,
      getTransactionByIdRepositoryStub
    }
  }

  it('Should return transaction data updated successfully', async () => {
    // arrange
    const {sut} = makeSut()


    // act
    const result = await sut.execute(transactionIdParams, {...updateTransactionParams, name: 'PRODUCT_NAME_UPDATED'})

    // assert
    expect(result).toBeTruthy()
    expect(result.name).toEqual('PRODUCT_NAME_UPDATED')
  })

  it('Should call GetTransactionById with correct params', async () => {
    // arrange
    const {sut, getTransactionByIdRepositoryStub} = makeSut()

    const executeSpy = jest.spyOn(getTransactionByIdRepositoryStub, 'execute')

    // act
    await sut.execute(transactionIdParams, {...updateTransactionParams, description: 'income_updated'})

    // assert
    expect(executeSpy).toHaveBeenCalledWith(transactionIdParams)
  })
  
  it('Should throw NotFound error if transaction not found', async () => {
    // arrange
    const { sut, getTransactionByIdRepositoryStub } = makeSut()

    jest.spyOn(getTransactionByIdRepositoryStub, 'execute').mockImplementationOnce(() => null!)

    // act
    const execute = sut.execute(transactionIdParams, {...updateTransactionParams, date: new Date()})

    // assert
    await expect(execute).rejects.toThrow(NotFound)
  })

  it('Should call UpdateTransactionRepository', async () => {
    // arrange
    const {sut, udpateTransactionRepositoryStub} = makeSut()

    const executeSpy = jest.spyOn(udpateTransactionRepositoryStub, 'execute')
    
    const name = faker.commerce.productName()
    const description = faker.commerce.productDescription()

    // act
    await sut.execute(transactionIdParams, {...updateTransactionParams, name, description})

    // assert
    expect(executeSpy).toHaveBeenCalled()
  })
})