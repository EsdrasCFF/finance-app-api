import { faker } from "@faker-js/faker"
import { IGetUserByEmailRepository } from "../../../../repositories/user/get-user-by-email"
import { GetUserByEmailService } from "../../../../services/user/get-user-by-email"

describe('GetUserByEmailServie', () => {
  
  const userIdParams = faker.string.uuid()

  const userData = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({length: 7})
  }
  
  class GetUserByEmailRepositoryStub implements IGetUserByEmailRepository {
    async execute(email: string) {
      return {
        ...userData,
        email: email,
        id: userIdParams
      }
    }
  }


  const makeSut = () => {
    const getUserByEmailRepositoryStub = new GetUserByEmailRepositoryStub()

    const sut = new GetUserByEmailService(getUserByEmailRepositoryStub)
  
    return {sut, getUserByEmailRepositoryStub}
  }

  it('Should return user data if found user by email', async () => {
    //arrange
    const { sut } = makeSut()
  
    //act
    const result = await sut.execute(userData.email)
  
    //assert
    expect(result).toBeTruthy()
  })

  it('Shoudl return null value if user not found', async () => {
    //arrange
    const {sut, getUserByEmailRepositoryStub} = makeSut()

    //@ts-expect-error
    jest.spyOn(getUserByEmailRepositoryStub, 'execute').mockImplementationOnce(() => null)
  
    //act
    const result = await sut.execute(userData.email)

    //asert
    expect(result).toBeFalsy()
    expect(result).toBeNull()
  })

})