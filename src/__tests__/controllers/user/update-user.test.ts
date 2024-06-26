import { faker } from "@faker-js/faker"
import { IUpdateUserService, UpdateUserProps } from "../../../services/user/update-user"
import validator from "validator"
import { BadRequest } from "../../../routes/_errors/bad-request"
import { UpdateUserController } from "../../../controllers/user/update-user"

describe('CreateUserController', () => {

  const userIdParams = faker.string.uuid()

  const updateUserParams = {
    first_name: null,
    last_name: null,
    email: null,
    password: null,
    old_password: null
  }

  class UpdateUserServiceStub implements IUpdateUserService {
    async execute(userId: string, updateUserParams: UpdateUserProps) {

      const userIdIsValid = validator.isUUID(userId)

      if(!userIdIsValid) {
        throw new BadRequest()
      }

      const updatedUserData = {
        id: userId,
        first_name: updateUserParams.first_name || faker.person.firstName(),
        last_name: updateUserParams.last_name || faker.person.lastName(),
        email: updateUserParams.email || faker.internet.email(),
        password: updateUserParams.password || faker.internet.password({length: 8})
      }

      return updatedUserData
    }
  }

  const makeSut = () => {
    const updateUserServiceStub = new UpdateUserServiceStub()
    const sut = new UpdateUserController(updateUserServiceStub)
  
    return {updateUserServiceStub, sut}
  }

  it('Should return user data if user is updated successfully', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const result = await sut.execute(userIdParams, {...updateUserParams, first_name: faker.person.firstName()})

    //assert
    expect(result.first_name).not.toEqual(updateUserParams.first_name)
    expect(result).not.toBeFalsy()
    expect(result).not.toBeNull()
  })
})