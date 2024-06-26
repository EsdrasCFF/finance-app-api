import validator from "validator"
import { IGetTransactionsByUserIdService } from "../../../../services/transaction/get-transactions-by-userId"
import { GetTransactionsByUserIdController } from "../../../../controllers/transaction/get-transactions-by-userId"
import { BadRequest } from "../../../../routes/_errors/bad-request"
import { NotFound } from "../../../../routes/_errors/not-found"
import { ServerError } from "../../../../routes/_errors/server-error"
import { transactionsData, userIdParams } from "../../../fixtures/transaction"

describe('GetTransctionsByUserId', () => {

  class GetTransactionByUserServiceStub implements IGetTransactionsByUserIdService {
    async execute(userId: string) {
      const userIdIsValid = validator.isUUID(userId)

      if(!userIdIsValid) {
        throw new BadRequest()
      }

      return transactionsData
    }
  }

  const makeSut = () => {
    const getTransactionsByUserIdServiceStub = new GetTransactionByUserServiceStub()
    const sut = new GetTransactionsByUserIdController(getTransactionsByUserIdServiceStub)

    return {getTransactionsByUserIdServiceStub, sut}
  }

  it('Should return transaction data if request occured successfully', async () => {
    //arrange
    const { sut } = makeSut()
  
    //act
    const result = await sut.execute(userIdParams)

    //assert
    expect(result).toBeTruthy()
    expect(result[0]).toEqual(transactionsData[0])
    expect(result[0].name).toEqual(transactionsData[0].name)
  })

  it('Should throw BadRequest instance if provided userId is not valid!', async () => {
    //arrange
    const {sut} = makeSut()

    //act
    const result = sut.execute('invalid_user_id')

    //assert
    await expect(result).rejects.toThrow(BadRequest)
  })

  it('Should throw NotFound instance error if user not found by is', async () => {
    //arrange
    const {sut, getTransactionsByUserIdServiceStub} = makeSut()

    jest.spyOn(getTransactionsByUserIdServiceStub, 'execute').mockImplementationOnce(() => {
      throw new NotFound()
    })

    //act
    const result = sut.execute(userIdParams)

    //assert
    await expect(result).rejects.toThrow(NotFound)
  })

  it('Should throw ServerError instance error if unknown error occur', async () => {
    //arrange
    const {getTransactionsByUserIdServiceStub, sut} = makeSut()
  
    jest.spyOn(getTransactionsByUserIdServiceStub, 'execute').mockImplementationOnce(() => {
      throw new ServerError()
    })
  
    //act
    const result = sut.execute(userIdParams)

    //assert
    await expect(result).rejects.toThrow()
  })

  it('Should call GetTransactionByUserId with correct params', async () => {
    //arrange
    const { getTransactionsByUserIdServiceStub, sut } = makeSut()
  
    const executeSpy = jest.spyOn(getTransactionsByUserIdServiceStub, 'execute')

    //act
    await sut.execute(userIdParams)

    //assert
    expect(executeSpy).toHaveBeenCalledWith(userIdParams)
  })

  it('Should throw BadRequest instance error if userId params is not provided!', async () => {
    //arrange
    const { sut } = makeSut()
  
    //act
    const result = sut.execute(null)

    await expect(result).rejects.toThrow(BadRequest)
  })
})