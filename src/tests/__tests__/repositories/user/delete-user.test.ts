import { db } from "../../../../lib/prisma"
import { DeleteUserRepository } from "../../../../repositories/user/delete-user"
import { createUserParams } from "../../../fixtures/user"

describe('DeleteUserRepository', () => {
  
  it('Should delete user successfully', async () => {
    const sut = new DeleteUserRepository()
  
    const createdUser = await db.user.create({
      data: createUserParams
    })
  
    const result = await sut.execute(createdUser.id)

    expect(createdUser).toStrictEqual(result)
  })

  it('Should call DataBase with correct params', async () => {
    const sut = new DeleteUserRepository()
    const dbSpy = jest.spyOn(db.user, 'delete')

    const createdUser = await db.user.create({
      data: createUserParams
    })

    await sut.execute(createdUser.id)

    expect(dbSpy).toHaveBeenCalledWith({
      where: {
        id: createdUser.id
      }
    })
  })
})