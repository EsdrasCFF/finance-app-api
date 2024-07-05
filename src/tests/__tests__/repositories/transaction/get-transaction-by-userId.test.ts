import { db } from "../../../../lib/prisma"
import { GetTransactionsByUserIdRepository } from "../../../../repositories/transaction/get-transactions-by-userId"
import { transactionData, transactionsData } from "../../../fixtures/transaction"
import { createUserParams } from "../../../fixtures/user"

describe('GetTransactionByUserId', () => {
  it('Should get transactions by UserId', async () => {
    const user = await db.user.create({data: createUserParams})

    const transactions = await db.transaction.createMany({
      data: transactionsData.map((data) => {
        return {...data, user_id: user.id}
      })
    })

    const sut = new GetTransactionsByUserIdRepository()

    const result = await sut.execute(user.id)

    expect(result).toBeTruthy()
    expect(result.length).toBe(2)
  })
})