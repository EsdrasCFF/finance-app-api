import { faker } from "@faker-js/faker"
import { IGetTransactionsByUserIdRepository } from "../../../repositories/transaction/get-transactions-by-userId"
import { GetTransactionsByUserIdService } from "../../../services/transaction/get-transactions-by-userId"
import { TRANSACTION_TYPE } from "@prisma/client"
import { IGetUserByIdRepository } from "../../../repositories/user/get-user-by-id"
import { NotFound } from "../../../routes/_errors/not-found"

describe('GetTransactionByUserIdRepository', () => {

  const userIdParams = faker.string.uuid()
  
  const transactionData = {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    amount: faker.number.float({min: 100.50, max: 500.50}),
    date: faker.date.recent(),
    user_id: userIdParams,
    type: 'INCOME' as TRANSACTION_TYPE
  }

  const transactions = [transactionData]

  const userData = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({length: 8})
  }

  class GetTransactionsByUserIdRepositoryStub implements IGetTransactionsByUserIdRepository {
    async execute(userId: string) {

      return transactions
    }
  }

  class GetUserByIdRepositoryStub implements IGetUserByIdRepository {
    async execute(userId: string) {
      return {
        ...userData,
        id: userId
      }
    }
  }

  const makeSut = () => {
    const getTransactionsByUserIdRepositoryStub = new GetTransactionsByUserIdRepositoryStub()
    const getUserByIdRepositoryStub = new GetUserByIdRepositoryStub()

    const sut = new GetTransactionsByUserIdService(
      getTransactionsByUserIdRepositoryStub,
      getUserByIdRepositoryStub
    )

    return {sut, getTransactionsByUserIdRepositoryStub, getUserByIdRepositoryStub}
  }

  it('Should return transaction data successfully', async () => {
    // arrange
    const { sut } = makeSut()

    // act
    const result = await sut.execute(userIdParams)

    // assert
    expect(result).toBeTruthy()
    expect(result[0].user_id).toEqual(userIdParams)
  })

  it('Should call GetTransactionsByUserIdRepository with correct params', async () => {
    // arrange
    const {sut, getTransactionsByUserIdRepositoryStub} = makeSut()
    
    const executeSpy = jest.spyOn(getTransactionsByUserIdRepositoryStub, 'execute')
    
    // act
    await sut.execute(userIdParams)
    
    //assert
    expect(executeSpy).toHaveBeenCalledWith(userIdParams)
  })

  it('Should NotFound instance error is throwed if user not found', async () => {
    // arrange
    const {sut, getUserByIdRepositoryStub} = makeSut()

    jest.spyOn(getUserByIdRepositoryStub, 'execute').mockImplementationOnce(() => null!)

    // act
    const result = sut.execute(userIdParams)

    // assert
    await expect(result).rejects.toThrow(NotFound)
  })

  it('Should call GetUserByIdRepository with correct params',  async () => {
    // arrange
    const { sut, getUserByIdRepositoryStub } = makeSut()

    const executeSpy = jest.spyOn(getUserByIdRepositoryStub, 'execute')

    // act
    await sut.execute(userIdParams)
  
    // assert
    expect(executeSpy).toHaveBeenCalledWith(userIdParams)
  })
})