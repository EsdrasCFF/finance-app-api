import { GetUserByIdController } from "../../../../controllers/user/get-user-by-id"
import { makeGetUserByIdController } from "../../../../factories/controllers/users"

describe('Transaction Controller Factories', () => {
  it('Should return a valid GetUserByIdController instance', () => {
    expect(makeGetUserByIdController).toBeInstanceOf(GetUserByIdController)
  })
})