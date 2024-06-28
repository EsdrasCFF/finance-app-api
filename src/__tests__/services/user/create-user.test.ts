import { fa, faker } from "@faker-js/faker"
import { ICreateUserRepository } from "../../../repositories/user/create-users"
import { IGetUserByEmailRepository } from "../../../repositories/user/get-user-by-email"
import { User } from "@prisma/client"
import { IPasswordComparatorAdapter } from "../../../adapters/password-comparator"
import { IPasswordHasherAdapter } from "../../../adapters/password-hasher"
import { CreateUserService } from "../../../services/user/create-user"
import { BadRequest } from "../../../routes/_errors/bad-request"

describe('CreateUserService', () => {
  
  const createUserParams = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({length: 7})
  }
  
  class GetUserByEmailRepositoryStub implements IGetUserByEmailRepository {
    async execute(email: string) {
      return null
    }
  }

  class CreateUserRepositoryStub implements ICreateUserRepository {
    async execute(createUserParams: Omit<User, 'id'>) {
      const userData = {
        ...createUserParams,
        id: faker.string.uuid()
      }

      return userData
    }
  }

  class PasswordHasherAdapterStub implements IPasswordHasherAdapter {
    async execute(password: string) {
      return `${password}hashed_password`
    }
  }



  const makeSut = () => {
    const createUserRepository = new CreateUserRepositoryStub()
    const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
    const passwordHasherAdapter = new PasswordHasherAdapterStub()

    
    const sut = new CreateUserService(
      createUserRepository,
      getUserByEmailRepository,
      passwordHasherAdapter
    )
    
    return {
      sut,
      createUserRepository,
      getUserByEmailRepository,
      passwordHasherAdapter,
    }
  }

  it('Should return a created user successfully', async () => {
    //arrange
    const { sut } = makeSut()


    //act
    const result = await sut.execute(createUserParams)

    //assert
    expect(result).toBeTruthy()
    expect(result.first_name).toEqual(createUserParams.first_name)
    expect(result.password).toBeTruthy()
  })

  it('Should throw BadRequest error if GetUserByEmailRepository if returns a user', async () => {
    //arrange
    const {sut, getUserByEmailRepository} = makeSut()

    //@ts-ignore
    jest.spyOn(getUserByEmailRepository, 'execute').mockReturnValueOnce({...createUserParams, id: faker.string.uuid()})
    
    //act
    const result = sut.execute(createUserParams)

    //assert
    await expect(result).rejects.toThrow(BadRequest)
  })
})