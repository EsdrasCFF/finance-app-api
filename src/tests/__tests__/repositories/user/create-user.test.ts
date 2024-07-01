import { CreateUserRepository } from "../../../../repositories/user/create-users"
import { createUserParams } from "../../../fixtures/user"

describe('CreateUserRepository', () => {
  it('Should create a user on db', async () => {
    const sut = new CreateUserRepository()

    const result = await sut.execute(createUserParams)

    expect(result).toBeTruthy()
    expect(result.email).toEqual(createUserParams.email)
    expect(result.first_name).toEqual(createUserParams.first_name)
  })
})