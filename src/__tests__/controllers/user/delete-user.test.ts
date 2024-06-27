import { faker } from "@faker-js/faker";
import { DeleteUserController, IDeleteUserController } from "../../../controllers/user/delete-user";
import { IDeleteUserService } from "../../../services/user/delete-user";
import validator from "validator";
import { BadRequest } from "../../../routes/_errors/bad-request";
import { NotFound } from "../../../routes/_errors/not-found";
import { ServerError } from "../../../routes/_errors/server-error";

describe('Delete user controller', () => {

  const userData = {
    id: faker.string.uuid(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({length: 8})
  }

  class DeleteUserServiceStub implements IDeleteUserService {
    async execute(userId: string) {

      const userIdIsNotValid = validator.isUUID(userId)

      if(!userIdIsNotValid) {
        throw new BadRequest('Provided UserId is not valid!')
      }

      return userData
    }
  }

  const userIdParams = faker.string.uuid()

  const makeSut = () => {
    const deleteUserService = new DeleteUserServiceStub()
    const sut = new DeleteUserController(deleteUserService)
  
    return { deleteUserService, sut }
  }

  
  it('Should returns user data if user is deleted', async () => {
    // arrange
    const { sut } = makeSut()


    // act
    const result = await sut.execute(userIdParams)

    //assert
    expect(result).toBeTruthy()
    expect(result).not.toBeNull()
    expect(result).not.toBeUndefined()
    expect(result).toBe(userData)
  })

  it('Should throw BadRequest instance error if userId is not valid!', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const result = sut.execute('123')

    //assert
    await expect(result).rejects.toThrow(BadRequest)
  })

  it('Should throw NotFound instance error if user not found', async () => {
    // arrange
    const { sut, deleteUserService } = makeSut()

    jest.spyOn(deleteUserService, 'execute').mockImplementationOnce(() => {
      throw new NotFound()
    })
    
    // act
    const result = sut.execute(userIdParams)

    // assert
    await expect(result).rejects.toThrow(NotFound)
  })

  it('Should throw ServerError instance error if others errors', async () => {
    //arrange
    const { deleteUserService, sut } = makeSut()
  
    jest.spyOn(deleteUserService, 'execute').mockImplementationOnce(() => {
      throw new ServerError()
    })

    //act
    const result = sut.execute(userIdParams)

    //assert
    await expect(result).rejects.toThrow(ServerError)
  })

  it('Should call DeleteUserService with correct params', async () => {
    //arrange
    const { deleteUserService, sut } = makeSut()
  
    const executeSpy = jest.spyOn(deleteUserService, 'execute')
  
    //act
    await sut.execute(userIdParams)

    //assert
    expect(executeSpy).toHaveBeenCalledWith(userIdParams)
  })
})