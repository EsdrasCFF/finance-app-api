import { db } from "../../../../lib/prisma"
import { GetUserBalanceRepository } from "../../../../repositories/user/get-user-balance"
import { createUserParams } from "../../../fixtures/user"

describe('GetUserBalanceRepository', () => {
  it("Should get user balancce on db", async () => {
    const user = await db.user.create({data: createUserParams})

    await db.transaction.createMany({
      data: [
        {
          amount: 5000,
          date: new Date(),
          name: 'RECEITA',
          type: 'INCOME',
          user_id: user.id
        },
        {
          amount: 5000,
          date: new Date(),
          name: 'RECEITA',
          type: 'INCOME',
          user_id: user.id
        },
        {
          amount: 2000,
          date: new Date(),
          name: 'despesa',
          type: 'EXPENSE',
          user_id: user.id
        },
        {
          amount: 3000,
          date: new Date(),
          name: 'despesa',
          type: 'EXPENSE',
          user_id: user.id
        },
        {
          amount: 1000,
          date: new Date(),
          name: 'investimento',
          type: 'INVESTMENT',
          user_id: user.id
        },
        {
          amount: 2000,
          date: new Date(),
          name: 'investimento',
          type: 'INVESTMENT',
          user_id: user.id
        }
      ]
    })

    const sut = new GetUserBalanceRepository()

    const result = await sut.execute(user.id)

    expect(Number(result.incomes)).toEqual(10000)
    expect(Number(result.expenses)).toEqual(5000)
    expect(Number(result.investments)).toEqual(3000)
    expect(Number(result.balance)).toEqual(2000)
  })
})