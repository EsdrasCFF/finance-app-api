import { faker } from "@faker-js/faker";
import { DeleteUserController, IDeleteUserController } from "../../../controllers/user/delete-user";
import { IDeleteUserService } from "../../../services/user/delete-user";

describe('Delete user controller', () => {

  class DeleteUserServiceStub implements IDeleteUserService {
    async execute(userId: string) {
      const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({length: 8})
      }
    
      return user
    }
  }

  const userIdParams = faker.string.uuid()

  const makeSut = () => {
    const deleteUserService = new DeleteUserServiceStub()
    const sut = new DeleteUserController(deleteUserService)
  
    return { deleteUserService, sut }
  }

  
  it('Should return user data if user is deleted', async () => {
    // arrange
    const { deleteUserService, sut } = makeSut()


    // act

    const result = await sut.execute(userIdParams)

    //assert

    expect(result).toBeTruthy()
    expect(result).not.toBeNull()
    expect(result).not.toBeUndefined()
  })

})