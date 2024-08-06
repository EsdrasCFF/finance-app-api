import { faker } from "@faker-js/faker"
import { IPasswordComparatorAdapter } from "../../../../adapters/password-comparator"
import { IPasswordHasherAdapter } from "../../../../adapters/password-hasher"
import { IGetUserByEmailRepository } from "../../../../repositories/user/get-user-by-email"
import { IGetUserByIdRepository } from "../../../../repositories/user/get-user-by-id"
import { IUpdateUserRepository } from "../../../../repositories/user/update-user"
import { BadRequest } from "../../../../routes/_errors/bad-request"
import { UpdateUserProps, UpdateUserService } from "../../../../services/user/update-user"


describe('UpdateUserService', () => {
  const userIdParams = faker.string.uuid()

  const updateUserParams = {
    first_name: null,
    last_name: null,
    email: null,
    password: null,
    old_password: null
  }
  
  class GetUserByIdRepositoryStub implements IGetUserByIdRepository {
    async execute(userId: string) {
      const data = {
        id: userId,
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({length: 7})
      }
      return data
    }
  }
  
  class GetUserByEmailRepositoryStub implements IGetUserByEmailRepository {
    async execute(email: string) {
      if(email) null
      return null
    }
  }

  class UpdateUserRepositoryStub implements IUpdateUserRepository {
    async execute(userId: string, updateUserParams: Omit<UpdateUserProps, 'old_password'>) {
      const userData = {
        first_name: updateUserParams.first_name || faker.person.firstName(),
        last_name: updateUserParams.last_name || faker.person.lastName(),
        email: updateUserParams.email || faker.internet.email(),
        password: updateUserParams.password || faker.internet.password({length: 7}),
      }

      return {
        id: userId,
        ...userData
      }
    }
  }

  class PasswordComparatorAdapterStub implements IPasswordComparatorAdapter {
    async execute(new_password: string, old_password: string) {
      if(new_password || old_password) {
        return true
      }
      return true
    }
  }

  class PasswordHasherAdapterStub implements IPasswordHasherAdapter {
    async execute(password: string) {
      return password
    }
  }

  const makeSut = () => {
    const getUserByIdRepositoryStub = new GetUserByIdRepositoryStub()
    const getUserByEmailRepositoryStub = new GetUserByEmailRepositoryStub()
    const updateUserRepositoryStub = new UpdateUserRepositoryStub()
    const passwordComparatorAdapaterStub = new PasswordComparatorAdapterStub()
    const passwordHasherAdapterStub = new PasswordHasherAdapterStub()

    const sut = new UpdateUserService(
      getUserByIdRepositoryStub,
      getUserByEmailRepositoryStub,
      updateUserRepositoryStub,
      passwordComparatorAdapaterStub,
      passwordHasherAdapterStub
    )

    return {
      sut,
      getUserByEmailRepositoryStub,
      getUserByIdRepositoryStub,
      updateUserRepositoryStub,
      passwordComparatorAdapaterStub,
      passwordHasherAdapterStub
    }
  }
  
  it('Should return user data successfully', async () => {
    // arrange
    const {sut} = makeSut()

    // act
    const result = await sut.execute(userIdParams, updateUserParams)

    // asset
    expect(result).toBeTruthy()
    expect(result.email).not.toBeNull()
    expect(result.first_name).not.toBeNull()
    expect(result.password).not.toBeNull()
  })

  it('Should return user updated when email was sent with params', async () => {
    // arrange
    const {sut} = makeSut()

    // act
    const result = await sut.execute(userIdParams, {...updateUserParams, email: faker.internet.email()})

    // assert
    expect(result).toBeTruthy()
    expect(result.email).not.toBeNull()
  })

  it('Should throw BadRequest instance error if user not found by id', async () => {
    // arrange
    const { sut, getUserByIdRepositoryStub } = makeSut()

    jest.spyOn(getUserByIdRepositoryStub, 'execute').mockImplementationOnce(() => null!)

    // act
    const result = sut.execute(userIdParams, updateUserParams)

    //assert
    await expect(result).rejects.toThrow(BadRequest)
  })

  it('Should throw BadRequest instance error if email already in use', async () => {
    // arrange
    const {sut, getUserByEmailRepositoryStub } = makeSut()
    
    //@ts-expect-error Ignore due incorrect params to check if errors is correct throwed
    jest.spyOn(getUserByEmailRepositoryStub, 'execute').mockImplementationOnce(() => new BadRequest())

    //act
    const execute = sut.execute(userIdParams, {...updateUserParams, email: faker.internet.email()})

    // assert
    await expect(execute).rejects.toThrow(BadRequest)
  })

  it('Should call GetUserByEmailRepository with correct params', async () => {
    // arrange
    const {sut, getUserByEmailRepositoryStub} = makeSut()
  
    const executeSpy = jest.spyOn(getUserByEmailRepositoryStub, 'execute')

    const email = faker.internet.email()

    // act
    await sut.execute(userIdParams, {...updateUserParams, email})

    // assert
    expect(executeSpy).toHaveBeenCalledWith(email)
  })

  it('Should throw BadRequest instance error if password is sent without old_password', async () => {
    // arrange
    const {sut} = makeSut()

    // act
    const result = sut.execute(userIdParams, {...updateUserParams, password: faker.internet.password({length: 7})})

    // assert
    expect(result).rejects.toThrow(BadRequest)
  })

  it('Should call PassworComparatorAdapter if password and old_password params are sent', async () => {
    // arrange
    const {sut, passwordComparatorAdapaterStub } = makeSut()
    
    const executeSpy = jest.spyOn(passwordComparatorAdapaterStub, 'execute')
    
    // act
     await sut.execute(
      userIdParams,
      {
        ...updateUserParams,
        password: faker.internet.password({length: 7}),
        old_password: faker.internet.password({length: 7})
      }
    )

    // assert
    expect(executeSpy).toHaveBeenCalled()
  })

  it('Should throw BadRequest instance error if password does not check', async () => {
    // arrange
    const { sut, passwordComparatorAdapaterStub } = makeSut()

    //@ts-expect-error Ignore due incorrect params to check if errors is correct throwed
    jest.spyOn(passwordComparatorAdapaterStub, 'execute').mockReturnValueOnce(false)

    // act
    const result = sut.execute(
      userIdParams,
      {
        ...updateUserParams,
        password: faker.internet.password({length: 7}),
        old_password: faker.internet.password({length: 7})
      }
    )

    // assert
    await expect(result).rejects.toThrow(BadRequest)
  })

  it('Should call PasswordHasherAdapter with password and old_password match', async () => {
    // arrange
    const {sut, passwordHasherAdapterStub} = makeSut()
  
    const executeSpy = jest.spyOn(passwordHasherAdapterStub, 'execute')
  
    // act
     await sut.execute(
      userIdParams,
      {
        ...updateUserParams,
        password: faker.internet.password({length: 7}),
        old_password: faker.internet.password({length: 8})
      }
    )

    // assert
    expect(executeSpy).toHaveBeenCalled()
  })

  it('Should call UpdateUserRepository with correct params', async () => {
    // arrange
    const {sut, updateUserRepositoryStub} = makeSut()

    const userParams = {
      ...updateUserParams,
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
    }

    const executeSpy = jest.spyOn(updateUserRepositoryStub, 'execute')

    // act
    await sut.execute(userIdParams, userParams)

    //assert
    expect(executeSpy).toHaveBeenCalled()
  })
})