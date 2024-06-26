import { faker } from "@faker-js/faker"
import { IUpdateUserService, UpdateUserProps } from "../../../services/user/update-user"
import validator from "validator"
import { BadRequest } from "../../../routes/_errors/bad-request"
import { UpdateUserController } from "../../../controllers/user/update-user"
import { assert } from "console"
import { ZodError } from "zod"

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

  it('Should throw ZodError instance error if provided email is not valid!', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const result = sut.execute(userIdParams, {...updateUserParams, email: 'invalid_email'})

    //assert
    await expect(result).rejects.toThrow(ZodError)
  })

  it('Should throw ZodError instance if invalid password is provided', async () => {
    //arrange
    const { sut } = makeSut()
  
    //act
    const result = sut.execute(userIdParams, 
      {
        ...updateUserParams, 
        password: faker.internet.password({length: 5}),
        old_password: faker.internet.password({length: 6})
      })
    
      //assert
      await expect(result).rejects.toThrow(ZodError)
  })

  it('Should throw BadRequest instance error if userId provided is not valid!', async () => {
    //arrange
    const {sut} = makeSut()
  
    //act
    const result = sut.execute('invalid_user_id', {...updateUserParams, first_name: faker.person.firstName()})
  
    //assert
    await expect(result).rejects.toThrow(BadRequest)
    await expect(result).rejects.not.toThrow(ZodError)
  })
})