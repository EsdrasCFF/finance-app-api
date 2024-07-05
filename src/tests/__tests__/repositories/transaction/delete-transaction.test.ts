import { db } from "../../../../lib/prisma"
import { DeleteTransactionRepository } from "../../../../repositories/transaction/delete-transaction"
import { DeleteUserRepository } from "../../../../repositories/user/delete-user"
import { createTransactionParams } from "../../../fixtures/transaction"
import { createUserParams } from "../../../fixtures/user"

describe('DeleteTransactionRepository', () => {
  it('Should delete transaction on db', async () => {
    const user = await db.user.create({data: createUserParams})
    const transaction = await db.transaction.create({data: {...createTransactionParams, user_id: user.id}})

    const sut = new DeleteTransactionRepository()

    const result = await sut.execute(transaction.id)

    expect(result).toBeTruthy()
    expect(result.id).toEqual(transaction.id)
  })

  it('Should call Prisma with correct params', async () => {
    const user = await db.user.create({data: createUserParams})
    const transaction = await db.transaction.create({data: {...createTransactionParams, user_id: user.id}})

    const sut = new DeleteTransactionRepository()

    const dbSpy = jest.spyOn(db.transaction, 'delete')

    await sut.execute(transaction.id)

    expect(dbSpy).toHaveBeenCalledWith({
      where: {
        id: transaction.id
      }
    })
  })
})