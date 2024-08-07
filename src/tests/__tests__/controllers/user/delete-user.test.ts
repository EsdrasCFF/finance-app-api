import validator from "validator";
import { DeleteUserController } from "../../../../controllers/user/delete-user";
import { BadRequest } from "../../../../routes/_errors/bad-request";
import { NotFound } from "../../../../routes/_errors/not-found";
import { ServerError } from "../../../../routes/_errors/server-error";
import { IDeleteUserService } from "../../../../services/user/delete-user";
import { userIdParams } from "../../../fixtures/transaction";
import { userData } from "../../../fixtures/user";

describe('Delete user controller', () => {

  class DeleteUserServiceStub implements IDeleteUserService {
    async execute(userId: string) {

      const userIdIsNotValid = validator.isUUID(userId)

      if(!userIdIsNotValid) {
        throw new BadRequest('Provided UserId is not valid!')
      }

      return userData
    }
  }

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
    expect(result.email).toBe(userData.email)
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