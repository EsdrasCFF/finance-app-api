import { faker } from "@faker-js/faker"
import { BalanceParams, IGetUserBalanceService } from "../../../services/user/get-user-balance"
import validator from "validator"
import { BadRequest } from "../../../routes/_errors/bad-request"
import { GetUserBalanceController } from "../../../controllers/user/get-user-balance"
import { ServerError } from "../../../routes/_errors/server-error"
import { balanceParams, userIdParams } from "../../../tests/fixtures/user"

describe('GetUserBalanceController', () => {

  class GetUserBalanceServiceStub implements IGetUserBalanceService {
    async execute(userId: string) {
      const userIdIsValid = validator.isUUID(userId)

      if(!userIdIsValid) {
        throw new BadRequest('Provided UserId is not valid!')
      }

      return balanceParams
    }
  }

  const makeSut = () => {
    const getUserBalanceServiceStub = new GetUserBalanceServiceStub()
    const sut = new GetUserBalanceController(getUserBalanceServiceStub)
  
    return { getUserBalanceServiceStub, sut }
  }

  it('Should return user balance data with valid userId', async () => {
    //arrange
    const { sut } = makeSut()
    

    //act
    const result = await sut.execute(userIdParams)

    //assert
    expect(result).toEqual(balanceParams)
    expect(result).not.toBeFalsy()
    expect(result).not.toBeUndefined()
  })

  it('Should throw BadRequest error if userId provided is not valid!', async () => {
    //arrange
    const { sut } = makeSut()
  
    //act
    const result = sut.execute('invalid_user_id')

    //assert
    await expect(result).rejects.toThrow(BadRequest)
  })

  it('Should throw ServerError error if GetUserBalance has unknown erros', async () => {
    //arrange
    const { sut, getUserBalanceServiceStub } = makeSut()

    jest.spyOn(getUserBalanceServiceStub, 'execute').mockImplementationOnce(() => {
      throw new ServerError()
    })

    //act
    const result = sut.execute(userIdParams)

    //assert
    await expect(result).rejects.toThrow()
  })

  it('Should call GetUserBalanceService with correct params', async () => {
    //arrange
    const { getUserBalanceServiceStub, sut } = makeSut()
  
    const executeSpy = jest.spyOn(getUserBalanceServiceStub, 'execute')

    //act
    await sut.execute(userIdParams)

    //assert
    expect(executeSpy).toHaveBeenCalledWith(userIdParams)
  })

  it('Shoul throw BadRequest instance error if userId is not provided', async () => {
    //arrange
    const { sut } = makeSut()
  
    //act
    //@ts-ignore
    const result = sut.execute(null)
  
    //assert
    await expect(result).rejects.toThrow(BadRequest)
  })
})