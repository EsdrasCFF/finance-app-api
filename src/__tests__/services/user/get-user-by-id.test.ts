import { faker } from "@faker-js/faker"
import { IGetUserByIdRepository } from "../../../repositories/user/get-user-by-id"
import { GetUserByIdService } from "../../../services/user/get-user-by-id"

describe('GetUserByIdService', () => {
  
  const userIdParams = faker.string.uuid()

  const userData = {
    id: userIdParams,
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({length: 7})
  }
  
  class GetUserByIdRepositoryStub implements IGetUserByIdRepository {
    async execute(userId: string) {
      return {
        ...userData,
        id: userId
      }
    }
  }

  const makeSut = () => {
    const getUserByIdRepositoryStub = new GetUserByIdRepositoryStub()
    const sut = new GetUserByIdService(getUserByIdRepositoryStub)

    return {sut, getUserByIdRepositoryStub}
  }

  it('Should get user data by id successfully', async () => {
    //arrang e
    const { sut } = makeSut()

    //act
    const result = await sut.execute(userIdParams)

    //assert
    expect(result).toBeTruthy()
    expect(result?.id).toEqual(userIdParams)
  })

  it('Should call GetUserByIdService with correct params', async () => {
    // arrange
    const { getUserByIdRepositoryStub, sut } = makeSut()
    const executeSpy = jest.spyOn(getUserByIdRepositoryStub, 'execute')

    //act
    await sut.execute(userIdParams)

    //assert
    expect(executeSpy).toHaveBeenCalledWith(userIdParams)
  })

  it('Should return null if user not found', async () => {
    // arrange
    const { sut, getUserByIdRepositoryStub } = makeSut()

    jest.spyOn(getUserByIdRepositoryStub, 'execute').mockResolvedValueOnce(null!)
    // act
    const result = await sut.execute('123456')

    //assert
    expect(result).toBeNull()
    expect(result).toEqual(null)
  })
})