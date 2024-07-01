import { faker } from "@faker-js/faker";
import { TRANSACTION_TYPE } from "@prisma/client";

export const createTransactionParams = {
  name: faker.person.firstName(),
  description: faker.definitions.lorem.words[0],
  date: faker.date.recent(),
  amount: 10.50,
  type: 'INCOME' as TRANSACTION_TYPE,
  user_id: faker.string.uuid()
}

export const userIdParams = faker.string.uuid()

export const transactionIdParams = faker.string.uuid()

export const transactionData = {
  id: transactionIdParams,
  user_id: faker.string.uuid(),
  name: faker.commerce.product.name[0],
  description: faker.commerce.product.name[1],
  date: faker.date.recent(),
  amount: faker.number.float(),
  type: 'INCOME' as TRANSACTION_TYPE
}

export const transactionsData = [
  {
    id: faker.string.uuid(),
    user_id: faker.string.uuid(),
    amount: faker.number.float(),
    name: faker.commerce.product.name[0],
    description: faker.commerce.product.name[0],
    date: faker.date.recent(),
    type: 'EXPENSE' as TRANSACTION_TYPE,
  },
  {
    id: faker.string.uuid(),
    user_id: faker.string.uuid(),
    amount: faker.number.float(),
    name: faker.commerce.product.name[0],
    description: faker.commerce.product.name[0],
    date: faker.date.recent(),
    type: 'EXPENSE' as TRANSACTION_TYPE,
  }
]


export const updateTransactionParams = {
  name: faker.person.bio(),
  description: faker.commerce.product.name[0],
  amount: 100,
  type: 'INCOME' as TRANSACTION_TYPE,
  date: faker.date.recent(),
}