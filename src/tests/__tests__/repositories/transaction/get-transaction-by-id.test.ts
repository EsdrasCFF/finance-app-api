import { db } from "../../../../lib/prisma"
import { createUserParams } from "../../../fixtures/user"
import { createTransactionParams } from "../../../fixtures/transaction"
import { GetTransactionByIdRepository } from "../../../../repositories/transaction/get-transaction-by-id"

describe('GetTransactionByIdRepository', () => {
  it('Should get transaction by id', async () => {
    const user = await db.user.create({data: createUserParams})
    const transaction = await db.transaction.create({data: {...createTransactionParams, user_id: user.id}})

    const sut = new GetTransactionByIdRepository()

    const result = await sut.execute(transaction.id)

    expect(result?.id).toEqual(transaction.id)
  })

  it('Should call Prisma with correct params', async () => {
    const user = await db.user.create({data: createUserParams})
    const transaction = await db.transaction.create({data: {...createTransactionParams, user_id: user.id}})

    const sut = new GetTransactionByIdRepository()

    const dbSpy = jest.spyOn(db.transaction, 'findUnique')

    await sut.execute(transaction.id)

    expect(dbSpy).toHaveBeenCalledWith({
      where: {
        id: transaction.id
      }
    })
  })
})