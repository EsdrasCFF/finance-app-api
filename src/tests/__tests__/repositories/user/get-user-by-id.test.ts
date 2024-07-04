import { db } from "../../../../lib/prisma"
import { GetUserByIdRepository } from "../../../../repositories/user/get-user-by-id"
import { createUserParams } from "../../../fixtures/user"

describe('GetUserByIdRepository', () => {
  
  it('Should get user user by id on db', async () => {
    const user = await db.user.create({data: createUserParams})

    const sut = new GetUserByIdRepository()

    const result = await sut.execute(user.id)
  
    expect(result?.id).toStrictEqual(user.id)
  })

  it('Should call Prisma with correct params', async () => {
    const user = await db.user.create({data: createUserParams})

    const sut = new GetUserByIdRepository()

    const dbSpy = jest.spyOn(db.user, 'findUnique')

    await sut.execute(user.id)

    expect(dbSpy).toHaveBeenCalledWith({
      where: {
        id: user.id
      }
    })
  })
})