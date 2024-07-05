import { db } from "../../../../lib/prisma"
import { UpdateTransactionRepository } from "../../../../repositories/transaction/update-transactions"
import { createTransactionParams, updateTransactionParams } from "../../../fixtures/transaction"
import { createUserParams } from "../../../fixtures/user"

describe('UpdateTransactionRepository', () => {
  it('Should update transaction correctly and retur transaction data updated', async () => {
    const user = await db.user.create({
      data: createUserParams
    })

    const transaction = await db.transaction.create({
      data: {
        ...createTransactionParams,
        user_id: user.id
      }
    })

    const sut = new UpdateTransactionRepository()

    const result = await sut.execute(transaction.id, updateTransactionParams)
  
    expect(result).toBeTruthy()
    expect(result.name).toEqual(updateTransactionParams.name)
    expect(result.type).toEqual(updateTransactionParams.type)
  })

  it('Should call prisma with correct params', async () => {
    const user = await db.user.create({
      data: createUserParams
    })

    const transaction = await db.transaction.create({
      data: {
        ...createTransactionParams,
        user_id: user.id
      }
    })

    const sut = new UpdateTransactionRepository()

    const dbSpy = jest.spyOn(db.transaction, 'update')

    await sut.execute(transaction.id, updateTransactionParams)
  
    expect(dbSpy).toHaveBeenCalledWith({
      where: {id: transaction.id},
      data: {...updateTransactionParams}
    })
  })
})