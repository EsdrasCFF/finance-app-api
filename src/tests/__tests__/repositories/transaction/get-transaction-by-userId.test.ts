import { db } from "../../../../lib/prisma"
import { GetTransactionsByUserIdRepository } from "../../../../repositories/transaction/get-transactions-by-userId"
import { transactionsData } from "../../../fixtures/transaction"
import { createUserParams } from "../../../fixtures/user"

describe('GetTransactionByUserId', () => {
  it('Should get transactions by UserId', async () => {
    const user = await db.user.create({data: createUserParams})

    await db.transaction.createMany({
      data: transactionsData.map((data) => {
        return {...data, user_id: user.id}
      })
    })

    const sut = new GetTransactionsByUserIdRepository()

    const result = await sut.execute(user.id)

    expect(result).toBeTruthy()
    expect(result.length).toBe(2)
  })

  it('Shoudl call Prisma with correct params', async () => {
    const user = await db.user.create({data: createUserParams})

    await db.transaction.createMany({
      data: transactionsData.map((data) => {
        return {...data, user_id: user.id}
      })
    })

    const dbSpy = jest.spyOn(db.transaction, 'findMany')

    const sut = new GetTransactionsByUserIdRepository()

    await sut.execute(user.id)

    expect(dbSpy).toHaveBeenCalledWith({
      where: {
        user_id: user.id
      }
    })
  })
})