import { faker } from "@faker-js/faker"
import { DeleteTransactionController, IDeleteTransactionController } from "../../../controllers/transaction/delete-transaction"
import { IDeleteTransactionService } from "../../../services/transaction/delete-transaction"
import { TRANSACTION_TYPE } from "@prisma/client"
import validator from "validator"
import { BadRequest } from "../../../routes/_errors/bad-request"
import { NotFound } from "../../../routes/_errors/not-found"
import { ServerError } from "../../../routes/_errors/server-error"

describe('DeleteTransactionController', () => {
  const transactionIdParams = faker.string.uuid()

  const transactionData = {
    id: transactionIdParams,
    user_id: faker.string.uuid(),
    name: faker.commerce.product.name[0],
    description: faker.commerce.product.name[1],
    date: faker.date.recent(),
    amount: faker.number.float(),
    type: 'INCOME' as TRANSACTION_TYPE
  }

  class DeleteTransactionServiceStub implements IDeleteTransactionService {
    async execute(transactionId: string) {
      
      const transactionIdIsValid = validator.isUUID(transactionId)

      if(!transactionIdIsValid) {
        throw new BadRequest()
      }

      return transactionData
    }
  }

  const makeSut = () => {
    const deleteTransactionServiceStub = new DeleteTransactionServiceStub()
    const sut = new DeleteTransactionController(deleteTransactionServiceStub)
  
    return {deleteTransactionServiceStub, sut}
  }

  it('Should return transaction data if transaction is deleted successfully', async () => {
    //arrange
    const { sut } = makeSut()
  
    //act
    const result = await sut.execute(transactionIdParams)

    //assert
    expect(result).toEqual(transactionData)
  })

  it('Should throw BadRequest instance error if userId is not valid!', async () => {
    //arrange
    const {sut} = makeSut()

    //act
    const result = sut.execute('transactionId_invalid')

    //assert
    await expect(result).rejects.toThrow(BadRequest)
  })

  it('Should throw NotFound instance error if transactionId not found', async () => {
    //arrange
    const { deleteTransactionServiceStub, sut } = makeSut()
  
    jest.spyOn(deleteTransactionServiceStub, 'execute').mockImplementationOnce(() => {
      throw new NotFound()
    })

    //act
    const result = sut.execute(transactionIdParams)

    //assert
    await expect(result).rejects.toThrow(NotFound)
  })

  it('Should throw ServerError instance if unknown error run', async () => {
    //arrange
    const { deleteTransactionServiceStub, sut } = makeSut()
    
    jest.spyOn(deleteTransactionServiceStub, 'execute').mockImplementationOnce(() => {
      throw new ServerError()
    })

    //act
    const result = sut.execute(transactionIdParams)

    //assert
    await expect(result).rejects.toThrow()

  })
})