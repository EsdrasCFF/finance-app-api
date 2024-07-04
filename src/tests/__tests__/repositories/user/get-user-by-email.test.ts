import { db } from "../../../../lib/prisma"
import { GetUserByEmailRepository } from "../../../../repositories/user/get-user-by-email"
import { createUserParams } from "../../../fixtures/user"

describe('GetUserByEmailRepository', () => {
  it('Should get user by email on db', async () => {
    const user = await db.user.create({data: createUserParams})
  
    const sut = new GetUserByEmailRepository()

    const result = await sut.execute(user.email)

    expect(result?.email).toStrictEqual(user.email)
  })
})