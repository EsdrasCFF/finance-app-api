import { faker } from "@faker-js/faker"
import { CreateTransactionProps, ICreateTransactionRepository } from "../../../repositories/transaction/create-transaction"
import { TRANSACTION_TYPE } from "@prisma/client"
import { IGetUserByIdRepository } from "../../../repositories/user/get-user-by-id"
import { CreateTransactionService } from "../../../services/transaction/create-transaction"

describe('CreateTransactionService', () => {
  
  const userIdParams = faker.string.uuid()
  
  const createTransactionParams = {
    user_id: userIdParams,
    name: faker.person.firstName(),
    description: faker.commerce.productDescription(),
    date: faker.date.recent(),
    amount: faker.number.float({min: 100, max: 500}),
    type: 'INCOME' as TRANSACTION_TYPE
  }

  const userData = {
    id: userIdParams,
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({length: 7})
  }

  class CreateTransactionRepositoryStub implements ICreateTransactionRepository {
    async execute(createTransactioParams: CreateTransactionProps) {
      return {
        ...createTransactioParams,
        id: faker.string.uuid()
      }
    }
  }

  class GetUserByIdRepositoryStub implements IGetUserByIdRepository {
    async execute(userId: string) {
      return userData
    }
  }

  const makeSut = () => {
    const createTransactionRepositoryStub = new CreateTransactionRepositoryStub()
    const getUserByIdRepositoryStub = new GetUserByIdRepositoryStub()

    const sut = new CreateTransactionService(createTransactionRepositoryStub, getUserByIdRepositoryStub)

    return {
      sut,
      createTransactionRepositoryStub,
      getUserByIdRepositoryStub
    }
  }

  it('Should create transaction successfully', async () => {
    // arrange
    const { sut } = makeSut()  
  
    // act
    const result = await sut.execute(createTransactionParams)
  
    // assert
    expect(result).toBeTruthy()
    expect(result.amount).not.toBeFalsy()
  })
})