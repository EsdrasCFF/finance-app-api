import { db } from "../../../../lib/prisma"
import { CreateTransactionRepository } from "../../../../repositories/transaction/create-transaction"
import { createTransactionParams } from "../../../fixtures/transaction"
import { createUserParams } from "../../../fixtures/user"

describe('CreateTransactionRepository', () => {
  it('Should create a transaction on db', async () => {
    const user = await db.user.create({data: createUserParams})

    const sut = new CreateTransactionRepository()

    const resut = await sut.execute({...createTransactionParams, user_id: user.id})

    expect(resut.name).toEqual(createTransactionParams.name)
    expect(resut.date).toEqual(createTransactionParams.date)
    expect(resut.type).toEqual(createTransactionParams.type)
    expect(resut.user_id).toEqual(user.id)
  })

  it('Should call Prisma with correct params', async () => {
    const user = await db.user.create({data: createUserParams})

    const dbSpy = jest.spyOn(db.transaction, 'create')
  
    const sut = new CreateTransactionRepository()

    await sut.execute({...createTransactionParams, user_id: user.id})

    expect(dbSpy).toHaveBeenCalled()
  })
})