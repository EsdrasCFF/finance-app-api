import { faker } from "@faker-js/faker"
import validator from "validator"
import { GetUserByIdController } from "../../../../controllers/user/get-user-by-id"
import { BadRequest } from "../../../../routes/_errors/bad-request"
import { NotFound } from "../../../../routes/_errors/not-found"
import { ServerError } from "../../../../routes/_errors/server-error"
import { IGetUserByIdService } from "../../../../services/user/get-user-by-id"
import { userIdParams } from "../../../fixtures/transaction"
import { userData } from "../../../fixtures/user"

describe('GetUserByIdController', () => {
  
  class GetUserByIdServiceStub implements IGetUserByIdService {
    async execute(userId: string) {
      const userIdIsValid = validator.isUUID(userId)

      if(!userIdIsValid) {
        throw new BadRequest()
      }

      return userData
    }
  }

  const makeSut = () => {
    const getUserByIdServiceStub = new GetUserByIdServiceStub()
    const sut = new GetUserByIdController(getUserByIdServiceStub)

    return {getUserByIdServiceStub, sut}
  }

  it('Should return user data if userId provided is valid and if user is found!', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const result = await sut.execute(userIdParams)

    //assert
    expect(result.email).toEqual(userData.email)
    expect(result.first_name).toEqual(userData.first_name)
    expect(result.id).toEqual(userData.id)
    expect(result.email).toEqual(userData.email)
  })

  it('Should throw BadRequest instance error if userId is not valid!', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const result = sut.execute(faker.string.alpha({length: {min: 5, max: 15}}))

    //assert
    await expect(result).rejects.toThrow(BadRequest)
  })

  it('Should throw NotFound instance Error if user not found by id', async () => {
    //arrange
    const { getUserByIdServiceStub, sut } = makeSut()
    
    jest.spyOn(getUserByIdServiceStub, 'execute').mockImplementationOnce(() => {
      throw new NotFound('User not found!')
    })

    //act
    const result = sut.execute(userIdParams)

    //assert
    await expect(result).rejects.toThrow('User not found!')
  })

  it('Should throw ServerError instance error to unknown erros', async () => {
    //arrange
    const { getUserByIdServiceStub, sut } = makeSut()
  
    jest.spyOn(getUserByIdServiceStub, 'execute').mockImplementationOnce(() => {
      throw new ServerError()
    })

    //act
    const result = sut.execute(userIdParams)

    //assert
    await expect(result).rejects.toThrow(ServerError)
  })

  it('Should call GetUserByIdService with correct params', async () => {
    //arrange
    const { getUserByIdServiceStub, sut } = makeSut()
  
    const executeSpy = jest.spyOn(getUserByIdServiceStub, 'execute')

    //act
    await sut.execute(userIdParams)

    //assert
    expect(executeSpy).toHaveBeenCalledWith(userIdParams)
  })

  it('Shoul return BadResquest instance error if Service return null', async () => {
    //arrange
    const { getUserByIdServiceStub, sut } = makeSut()
    
    //@ts-expect-error Ignore due incorrect params to check if errors is correct throwed
    jest.spyOn(getUserByIdServiceStub, 'execute').mockResolvedValue(null)

    //act
    const result = sut.execute(userIdParams)

    //assert
    await expect(result).rejects.toThrow(NotFound)
  })
})