import { faker } from "@faker-js/faker"
import { IGetUserBalanceRepository } from "../../../repositories/user/get-user-balance"
import { GetUserBalanceService } from "../../../services/user/get-user-balance"
import { GetUserByIdRepository, IGetUserByIdRepository } from "../../../repositories/user/get-user-by-id"
import { NotFound } from "../../../routes/_errors/not-found"

describe('GetUserBalanceServce', () => {

  const userIdParams = faker.string.uuid()

  const userBalance = {
    incomes: faker.number.float({min: 100, max: 500.90}),
    expenses: faker.number.float({min: 100, max: 500.90}),
    investments: faker.number.float({min: 100, max: 500.90}),
    balance: faker.number.float({min: 100, max: 500.90}),
  }

  const userData = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({length: 7})
  }
  

  class GetUserBalanceRepositoryStub implements IGetUserBalanceRepository {
    async execute(userId: string) {
      return userBalance
    }
  }

  class GetUserByIdRepositoryStub implements IGetUserByIdRepository {
    async execute(userIdParams: string) {
      return {
        ...userData,
        id: userIdParams
      }
    }
  }

  const makeSut = () => {
    const getUserBalanceRepository = new GetUserBalanceRepositoryStub()
    const getUserByIdRepository = new GetUserByIdRepositoryStub()

    const sut = new GetUserBalanceService(getUserBalanceRepository, getUserByIdRepository)
  
    return {sut, getUserBalanceRepository, getUserByIdRepository}
  }

  it('Should balance data if get user balance successfully', async () => {
    // arrange
    const { sut } = makeSut()

    //act
    const result = await sut.execute(userIdParams)
    
    //assert
    expect(result).toBeTruthy()
  })

  it('Should throw NotFound error if user not found', async () => {
    //arrange
    const {sut, getUserByIdRepository} = makeSut()
    
    //@ts-ignore
    jest.spyOn(getUserByIdRepository, 'execute').mockReturnValueOnce(null)
  
    //act
    const result = sut.execute(userIdParams)

    //assert
    await expect(result).rejects.toThrow(NotFound)
  })

  it('Should call GetUserByIdRepository with correct pararmas', async () => {
    //arrange
    const { sut, getUserByIdRepository } = makeSut()
  
    const executeSpy = jest.spyOn(getUserByIdRepository, 'execute')

    //act
    await sut.execute(userIdParams)

    //assert
    expect(executeSpy).toHaveBeenCalledWith(userIdParams)
  })

  it('Should call GetUserBalanceRepository with correct params', async () => {
    //arrange
    const {sut, getUserBalanceRepository} = makeSut()

    const executeSpy = jest.spyOn(getUserBalanceRepository, 'execute')

    //act
    await sut.execute(userIdParams)

    expect(executeSpy).toHaveBeenCalledWith(userIdParams)
  })
})