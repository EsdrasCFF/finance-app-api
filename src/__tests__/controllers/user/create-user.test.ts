import { User } from "@prisma/client"
import { CreateUserController } from "../../../controllers/user/create-user"
import { ICreateUserService } from "../../../services/user/create-user"
import { v4 as uuidv4 } from 'uuid'
import { ZodError } from "zod"
import { faker } from '@faker-js/faker'
import { BadRequest } from "../../../routes/_errors/bad-request"
import { ServerError } from "../../../routes/_errors/server-error"

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


  it('Should create an user', async () => {
    //arrange

    const crateUserServiceStub = new CreateUserServiceStub()
    const createUserController = new CreateUserController(crateUserServiceStub)

    const createUserParams = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({length: 7})
    }
    
    //act

    const result = await createUserController.execute(createUserParams)

    //assert
    expect(result.first_name).toBeTruthy()
    expect(result.email).not.toBeNull()
    expect(result).not.toBeUndefined()
  })

  it('Should throw an error if first_name is not provided', async () => {
    //arrange
    const crateUserServiceStub = new CreateUserServiceStub()
    const createUserController = new CreateUserController(crateUserServiceStub)

    const createUserParams = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: '',
      password: faker.internet.password({length: 7})
    }

    //act

    const result = createUserController.execute(createUserParams)

    //assert

    await expect(result).rejects.toThrow(ZodError)
  })

  it('Should throw an error if last_name is not provided', async () => {
    //arrange
    const crateUserServiceStub = new CreateUserServiceStub()
    const createUserController = new CreateUserController(crateUserServiceStub)

    const createUserParams = {
      first_name: faker.person.firstName(),
      last_name: '',
      email: faker.internet.email(),
      password: faker.internet.password({length: 7})
    }

    //act
    const result = createUserController.execute(createUserParams)

    //assert

    await expect(result).rejects.toThrow(ZodError)
  })

  it('Should throw an error when an invalid email is provided!', async () => {
    //arrange
    const crateUserServiceStub = new CreateUserServiceStub()
    const createUserController = new CreateUserController(crateUserServiceStub)

    const createUserParams = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: 'carlos',
      password: faker.internet.password({length: 7})
    }

    //act
    const result = createUserController.execute(createUserParams)

    //assert
  
    await expect(result).rejects.toThrow()
  })

  it('Should throw an error if password is less than 6 characteres is provided', async () => {
    //arrange
    const crateUserServiceStub = new CreateUserServiceStub()
    const createUserController = new CreateUserController(crateUserServiceStub)

    const createUserParams = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({length: 5})
    }

    // act
    const result = createUserController.execute(createUserParams)

    //assert
    await expect(result).rejects.toThrow()
  })

  it('Should call CreateUserService with correct params', async () => {
    //arrange
    const createUserServiceStub = new CreateUserServiceStub()
    const createUserController = new CreateUserController(createUserServiceStub)

    const createUserParams = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({length: 7})
    }

    const executeSpy = jest.spyOn(createUserServiceStub, 'execute')

    //act
    await createUserController.execute(createUserParams)

    //assert
    expect(executeSpy).toHaveBeenCalledWith(createUserParams)
  })

  it('Should throw an error if email already in use', async () => {
    //arranga
    const createUserServiceStub = new CreateUserServiceStub()
    const createUserController = new CreateUserController(createUserServiceStub)

    const createUserParams = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({length: 8})
    }

    jest.spyOn(createUserServiceStub, 'execute').mockImplementationOnce(() => {
      throw new BadRequest()
    })
    
    //act
    
    const result = createUserController.execute(createUserParams)

    //assert
  
    await expect(result).rejects.toThrow(BadRequest)
  })

  it('Should error when any error run', async () => {
    //arrange
    const createUserServiceStub = new CreateUserServiceStub()
    const createUserController = new CreateUserController(createUserServiceStub)

    const createUserParams = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({length: 8})
    }

    jest.spyOn(createUserServiceStub, 'execute').mockImplementationOnce(() => {
      throw new ServerError()
    })

    //act
    const result = createUserController.execute(createUserParams)


    //assert
     await expect(result).rejects.toThrow(ServerError)
  })
})