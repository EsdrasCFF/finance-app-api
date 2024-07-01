import { faker } from "@faker-js/faker"

import { User } from "@prisma/client"
import { IPasswordHasherAdapter } from "../../../../adapters/password-hasher"
import { ICreateUserRepository } from "../../../../repositories/user/create-users"
import { IGetUserByEmailRepository } from "../../../../repositories/user/get-user-by-email"
import { BadRequest } from "../../../../routes/_errors/bad-request"
import { CreateUserService } from "../../../../services/user/create-user"

describe('CreateUserService', () => {
  
  const createUserParams = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({length: 7})
  }
  
  const userIdParams = faker.string.uuid()

  class GetUserByEmailRepositoryStub implements IGetUserByEmailRepository {
    async execute(email: string) {
      return null
    }
  }

  class CreateUserRepositoryStub implements ICreateUserRepository {
    async execute(createUserParams: Omit<User, 'id'>) {
      const userData = {
        ...createUserParams,
        id: userIdParams
      }

      return userData
    }
  }

  class PasswordHasherAdapterStub implements IPasswordHasherAdapter {
    async execute(password: string) {
      return password
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

  it('Should call PasswordHasherAdapter', async () => {
    //arrange
    const { passwordHasherAdapter, sut } = makeSut()
    const executeSpy = jest.spyOn(passwordHasherAdapter, 'execute')

    //act
    await sut.execute(createUserParams)
    
    //assert
    expect(executeSpy).toHaveBeenCalled()
  })

  it('Should call CreateUserRepository with correctParams', async () => {
    //arrange
    const { sut, createUserRepository } = makeSut()

    const createUserRepositorySpy = jest.spyOn(createUserRepository, 'execute')

    //act
    await sut.execute(createUserParams)

    //assert
    expect(createUserRepositorySpy).toHaveBeenCalledWith(createUserParams)
  })

  it('Should call PasswordHasherAdapter and return password hash', async () => {
    // arrange
    const {sut, passwordHasherAdapter} = makeSut()

    const executeSpy = jest.spyOn(passwordHasherAdapter, 'execute')
    
    // act
    const result = await sut.execute(createUserParams)

    //assert
    expect(result).toBeTruthy()
    expect(executeSpy).toBeTruthy()
  })
})