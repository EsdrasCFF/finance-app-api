import { CreateUserController } from "../../../../controllers/user/create-user"
import { DeleteUserController } from "../../../../controllers/user/delete-user"
import { GetUserBalanceController } from "../../../../controllers/user/get-user-balance"
import { GetUserByIdController } from "../../../../controllers/user/get-user-by-id"
import { UpdateUserController } from "../../../../controllers/user/update-user"
import { makeCreateUserController, makeDeleteUserController, makeGetUserBalanceController, makeGetUserByIdController, makeUpdateUserController } from "../../../../factories/controllers/users"

describe('Transaction Controller Factories', () => {
  it('Should return a valid GetUserByIdController instance', () => {
    expect(makeGetUserByIdController()).toBeInstanceOf(GetUserByIdController)
  })

  it('Should return a valid GetUserByIdController instance', () => {
    expect(makeCreateUserController()).toBeInstanceOf(CreateUserController)
  })

  it('Should return a valid DeleteUserController instance', () => {
    expect(makeDeleteUserController()).toBeInstanceOf(DeleteUserController)
  })

  it('Should return a valid DeleteUserController instance', () => {
    expect(makeUpdateUserController()).toBeInstanceOf(UpdateUserController)
  })
  
  it('Should return a valid DeleteUserController instance', () => {
    expect(makeGetUserBalanceController()).toBeInstanceOf(GetUserBalanceController)
  })
})