import { CreateUserController } from "../../../../controllers/user/create-user"
import { DeleteUserController } from "../../../../controllers/user/delete-user"
import { GetUserByIdController } from "../../../../controllers/user/get-user-by-id"
import { makeCreateUserController, makeDeleteUserController, makeGetUserByIdController } from "../../../../factories/controllers/users"

describe('Transaction Controller Factories', () => {
  it('Should return a valid GetUserByIdController instance', () => {
    expect(makeGetUserByIdController).toBeInstanceOf(GetUserByIdController)
  })

  it('Should return a valid GetUserByIdController instance', () => {
    expect(makeCreateUserController).toBeInstanceOf(CreateUserController)
  })

  it('Should return a valid DeleteUserController instance', () => {
    expect(makeDeleteUserController).toBeInstanceOf(DeleteUserController)
  })
})