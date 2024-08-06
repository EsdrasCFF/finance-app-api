import { faker } from "@faker-js/faker"
import { IDeleteUserRepository } from "../../../../repositories/user/delete-user"
import { IGetUserByIdRepository } from "../../../../repositories/user/get-user-by-id"
import { NotFound } from "../../../../routes/_errors/not-found"
import { DeleteUserService } from "../../../../services/user/delete-user"

describe('DeleteUserService', () => {

  const createUserParams = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({length: 7})
  }
  
  const userIdParams = faker.string.uuid()
  
  class DeleteUserRepositoryStub implements IDeleteUserRepository {
    async execute(userId: string) {
      return {
        ...createUserParams,
        id: userId
      }
    }
  }

  class GetUserByIdRepositoryStub implements IGetUserByIdRepository {
    async execute(userId: string) {
      return {
        ...createUserParams,
        id: userId
      }
    }
  }

  const makeSut = () => {
    const deleteUserRepositoryStub = new DeleteUserRepositoryStub()
    const getUserByIdRepositoryStub = new GetUserByIdRepositoryStub()
    const sut = new DeleteUserService(deleteUserRepositoryStub, getUserByIdRepositoryStub)
  
    return {sut, deleteUserRepositoryStub, getUserByIdRepositoryStub}
  }

  it('Should return user data that was deleted', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const result = await sut.execute(userIdParams)

    //assert
    expect(result).toEqual({...createUserParams, id: userIdParams})

  })

  it('Should throw BadRequest error if user not found', async () => {
    //arrange
    const { sut, getUserByIdRepositoryStub } = makeSut()
    
    //@ts-expect-error
    jest.spyOn(getUserByIdRepositoryStub, 'execute').mockReturnValueOnce(null)

    //act
    const result = sut.execute(userIdParams)
  
    //assert
    await expect(result).rejects.toThrow(NotFound)
  })

  it('Should call DeleteUserRepository', async () => {
    // arrange
    const {sut, deleteUserRepositoryStub} = makeSut()
  
    const executeSpy = jest.spyOn(deleteUserRepositoryStub, 'execute')

    // act
    await sut.execute(userIdParams)

    // assert
    expect(executeSpy).toHaveBeenCalled()
  })

  it('Should call DeleteUserRepository with correct params', async () => {
    //arrange
    const { deleteUserRepositoryStub, sut } = makeSut()
  
    const executeSpy = jest.spyOn(deleteUserRepositoryStub, 'execute')

    //act
    await sut.execute(userIdParams)

    //assert
    expect(executeSpy).toHaveBeenCalledWith(userIdParams)
  })

})