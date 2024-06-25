import { User } from "@prisma/client"
import { CreateUserController } from "../../../controllers/user/create-user"
import { ICreateUserService } from "../../../services/user/create-user"
import { v4 as uuidv4 } from 'uuid'

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

  it('Should return null if provided first_name is falsy', async () => {
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

    const result = await createUserController.execute(createUserParams)

    //assert

    expect(result.first_name).toBeFalsy()
    expect(result.email).toBeFalsy()
  })

  it('Should error if email or last_name are not provided', async () => {
    //arrange
    const crateUserServiceStub = new CreateUserServiceStub()
    const createUserController = new CreateUserController(crateUserServiceStub)

    const createUserParams = {
      first_name: 'Esdras',
      last_name: '',
      email: '',
      password: '123456'
    }

    //act
    const result = await createUserController.execute(createUserParams)


    //assert
    expect(result.last_name).toBeFalsy()
    expect(result.email).toBeFalsy()
  })
})