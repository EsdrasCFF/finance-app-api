import { faker } from "@faker-js/faker";

export const userIdParams = faker.string.uuid()

export const createUserParams = {
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password({length: 7})
}

export const userData = {
  id: userIdParams,
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password({length: 8})
}

export const balanceParams = {
  incomes: faker.number.int({min: 1500, max: 2000}),
  expenses: faker.number.int({min: 800, max: 1600}),
  investments: faker.number.int({min: 100, max: 600}),
  balance: faker.number.int({min: 10, max: 500})
}

export const updateUserParams = {
  first_name: null,
  last_name: null,
  email: null,
  password: null,
  old_password: null
}

export const userDataWithoutPassword = {
  id: userIdParams,
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  email: faker.internet.email(),
}