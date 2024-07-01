import { faker } from "@faker-js/faker";
import { ICreateTransactionService } from "../../../services/transaction/create-transaction";
import { Transaction } from "@prisma/client";
import { CreateTransactionController } from "../../../controllers/transaction/create-transaction";
import { BadRequest } from "../../../routes/_errors/bad-request";
import { ZodError } from "zod";
import { createTransactionParams } from "../../../tests/fixtures/transaction";

describe('CreateTransactionController', () => {

  class CreateTransactionServiceStub implements ICreateTransactionService {
    async execute(createTransactionParams: Omit<Transaction, 'id'>) {
      
      const transactionData = { 
        ...createTransactionParams,
        id: faker.string.uuid()
      }

      return transactionData
    }

  }

  const makeSut = () => {
    const createTransactionServiceStub = new CreateTransactionServiceStub()
    const sut = new CreateTransactionController(createTransactionServiceStub)
  
    return {sut,  createTransactionServiceStub}
  }

  it('Should return transaction data if create transaction ocurred successfully', async () => {
    //arrange
    const {sut} = makeSut()
    
    //act
    const result = await sut.execute(createTransactionParams)
    
    //assert
    expect(result.amount).not.toBeNaN()
    expect(result.type).toEqual(createTransactionParams.type)
    expect(result.name).toEqual(createTransactionParams.name)
    expect(result.id).toBeTruthy()
  })

  it('Should return BadRequest instance error if amount is less than or equal 0', async () => {
    //arrange
    const {sut} = makeSut()

    //act
    const result = sut.execute({...createTransactionParams, amount: 0})

    //assert
    expect(result).rejects.toThrow(BadRequest)
  })

  it('Shoul return BadRequest isntance error if provided userId is not valid!', async () => {
    //arrange
    const {sut} = makeSut()
  
    //act
    const result = sut.execute({...createTransactionParams, user_id: 'invalid_userId'})

    //assert
    await expect(result).rejects.toThrow(ZodError)
  })

  it('Should return ZodError instance error if provided type is not TransactionType enum', async () => {
    //arrange
    const { sut } = makeSut()
    
    //act 
    // @ts-ignore
    const result = sut.execute({...createTransactionParams, type: 'invalid_type'})

    //assert
    await expect(result).rejects.toThrow()
  })

  it('Should return ZodError instance error if invalid date is provided', async () => {
    //arrange
    const { sut } = makeSut()
  
    //act
    //@ts-ignore
    const result = sut.execute({...createTransactionParams, date: 'invalid_date'})
  
    //assert
    await expect(result).rejects.toThrow(ZodError)
  })

  it('Should call CreateTransactionService with correct params', async () => {
    //arrange
    const { createTransactionServiceStub, sut } = makeSut()
  
    const executeSpy = jest.spyOn(createTransactionServiceStub, 'execute')

    const id = faker.string.uuid()

    //act
    await sut.execute(createTransactionParams)

    //assert
    expect(executeSpy).toHaveBeenCalledWith({...createTransactionParams, amount: createTransactionParams.amount * 100})
  })
})