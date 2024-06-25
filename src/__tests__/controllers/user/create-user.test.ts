import { User } from "@prisma/client"
import { CreateUserController } from "../../../controllers/user/create-user"
import { ICreateUserService } from "../../../services/user/create-user"
import { v4 as uuidv4 } from 'uuid'
import { ZodError } from "zod"

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
      first_name: 'Esdras',
      last_name: 'Castro',
      email: 'esdras@emai.com',
      password: '123456'
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
      first_name: '',
      last_name: 'Castro',
      email: '',
      password: '123456'
    }

    //act

    const result = createUserController.execute(createUserParams)

    //assert

    await expect(result).rejects.toThrow(ZodError)
  })
})