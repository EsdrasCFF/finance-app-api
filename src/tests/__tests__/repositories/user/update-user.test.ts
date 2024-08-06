import { faker } from "@faker-js/faker"
import { db } from "../../../../lib/prisma"
import { UpdateUserRepository } from "../../../../repositories/user/update-user"
import { createUserParams } from "../../../fixtures/user"

describe('UpdateUserRepository', () => {
  
  it('Should update user on db', async () => {
    const user = await db.user.create({
      data: createUserParams
    })

    const sut = new UpdateUserRepository()

    const first_name = faker.person.firstName()
    const last_name = faker.person.lastName()
    const email = faker.internet.email()
    const password = faker.internet.password()

    const result = await sut.execute(user.id, { first_name, last_name, email, password})

    expect(result.email).toEqual(email)
    expect(result.first_name).toEqual(first_name)
    expect(result.last_name).toEqual(last_name)
  })

  it('Should call Prisma with correct params', async () => {
    const user = await db.user.create({
      data: createUserParams
    })

    const first_name = faker.person.firstName()
    const last_name = faker.person.lastName()
    const email = faker.internet.email()
    const password = faker.internet.password()
    
    const sut = new UpdateUserRepository()

    const dbSpy = jest.spyOn(db.user, 'update')

    await sut.execute(user.id, {first_name, last_name, email, password})

    expect(dbSpy).toHaveBeenCalledWith({
      data: {
        first_name,
        last_name,
        email,
        password
      },
      where: {
        id: user.id
      }
    })
  })
})