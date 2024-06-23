import { db } from "../../lib/prisma"

export interface BalanceParams {
  incomes: number | bigint,
  expenses: number | bigint
  investments: number | bigint
  balance: number | bigint
}

export interface IGetUserBalanceRepository {
  execute(userId: string): Promise<BalanceParams>
}

export class GetUserBalanceRepository implements IGetUserBalanceRepository{
  async execute(userId: string) {
    const balance = await db.$queryRaw<BalanceParams[]>`
      SELECT 
        SUM(CASE WHEN type = 'INVESTMENT' THEN amount ELSE 0 END) AS investments,
        SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END) AS incomes,
        SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) AS expenses,
        (
          SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END)
          - SUM(CASE WHEN type = 'INVESTMENT' THEN amount ELSE 0 END)
          - SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END)
        ) AS balance
      
      FROM 
        transactions
      WHERE
          user_id = ${userId}
    `

    return balance[0]
  }
}