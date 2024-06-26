import { User } from "@prisma/client"
import { v4 as uuidv4 } from 'uuid'
import { ZodError } from "zod"
import { faker } from '@faker-js/faker'
import { ICreateUserService } from "../../../../services/user/create-user"
import { CreateUserController } from "../../../../controllers/user/create-user"
import { BadRequest } from "../../../../routes/_errors/bad-request"
import { ServerError } from "../../../../routes/_errors/server-error"
import { createUserParams } from "../../../fixtures/user"


describe('Create user controller', () => {

  class CreateUserServiceStub implements ICreateUserService {
    async execute(user: Omit<User, 'id'>) {

      const id = uuidv4()

      const newUser = {
        id,
        ...user
      }

      return newUser
    }
  }

  const makeSut = () => {
    const createUserServiceStub = new CreateUserServiceStub()
    const sut = new CreateUserController(createUserServiceStub)

    return {createUserServiceStub, sut}
  }

  it('Should create an user', async () => {
    //arrange
    const { sut } = makeSut()
      
    //act

    const result = await sut.execute(createUserParams)

    //assert
    expect(result.first_name).toBeTruthy()
    expect(result.email).not.toBeNull()
    expect(result).not.toBeUndefined()
  })

  it('Should throw ZodError if first_name is not provided', async () => {
    //arrange
    const {sut} = makeSut()


    //act

    const result = sut.execute({...createUserParams, first_name: ''})

    //assert

    await expect(result).rejects.toThrow(ZodError)
  })

  it('Should throw an error if last_name is not provided', async () => {
    //arrange
    const {sut} = makeSut()

    //act
    const result = sut.execute({...createUserParams, last_name: ''})

    //assert

    await expect(result).rejects.toThrow(ZodError)
  })

  it('Should throw an error when an invalid email is provided!', async () => {
    //arrange
    const { sut } = makeSut()
    //act
    const result = sut.execute({...createUserParams, email: 'fernando'})

    //assert
  
    await expect(result).rejects.toThrow()
  })

  it('Should throw an error if password is less than 6 characteres is provided', async () => {
    //arrange
    const { sut } = makeSut()

    // act
    const result = sut.execute({...createUserParams, password: faker.internet.password({length: 5})})

    //assert
    await expect(result).rejects.toThrow()
  })

  it('Should call CreateUserService with correct params', async () => {
    //arrange
    const { sut, createUserServiceStub } = makeSut()

    const executeSpy = jest.spyOn(createUserServiceStub, 'execute')

    //act
    await sut.execute(createUserParams)

    //assert
    expect(executeSpy).toHaveBeenCalledWith(createUserParams)
  })

  it('Should throw an error if provided e-mail is already in use', async () => {
    //arranga
    const { sut, createUserServiceStub } = makeSut()

    jest.spyOn(createUserServiceStub, 'execute').mockImplementationOnce(() => {
      throw new BadRequest()
    })
    
    //act
    
    const result = sut.execute(createUserParams)

    //assert
  
    await expect(result).rejects.toThrow(BadRequest)
  })

  it('Should error when any error run', async () => {
    //arrange
    const { sut, createUserServiceStub } = makeSut()

    jest.spyOn(createUserServiceStub, 'execute').mockImplementationOnce(() => {
      throw new ServerError()
    })

    //act
    const result = sut.execute(createUserParams)


    //assert
     await expect(result).rejects.toThrow(ServerError)
  })
})