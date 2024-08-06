import { faker } from "@faker-js/faker"
import { $Enums} from "@prisma/client"
import { ZodError } from "zod";
import { UpdateTransactionController } from "../../../../controllers/transaction/update-transaction";
import { BadRequest } from "../../../../routes/_errors/bad-request";
import { NotFound } from "../../../../routes/_errors/not-found";
import { ServerError } from "../../../../routes/_errors/server-error";
import { IUpdateTransactionService } from "../../../../services/transaction/update-transaction";
import { transactionIdParams, updateTransactionParams } from "../../../fixtures/transaction";


type TransactionParams = {
  name: string;
  description: string;
  amount: number;
  type: $Enums.TRANSACTION_TYPE;
  date: Date;
}

describe('UpdateTransactionController', () => {

  class UpdateTransactionServiceStub implements IUpdateTransactionService {
    async execute(transactionId: string, updateTransactionParams: TransactionParams ) {

      const transactionData = {
        ...updateTransactionParams,
        id: transactionId,
        user_id: faker.string.uuid()
      }
      return transactionData
    }
  }


  const makeSut = () => {
    const updateTransactionServiceStub = new UpdateTransactionServiceStub()
    const sut = new UpdateTransactionController(updateTransactionServiceStub)

    return {sut, updateTransactionServiceStub}
  }

  it('Should return transaction data successfully if provided params are correct', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const result = await sut.execute(transactionIdParams, updateTransactionParams)


    //assert
    expect(result).toBeTruthy()
    expect(result.date).toEqual(updateTransactionParams.date)
    expect(result.name).toEqual(updateTransactionParams.name)
    expect(result.description).toEqual(updateTransactionParams.description)
  })

  it('Should throw BadRequest instance error if transactionId provided is not valid!', async () => {
    //arrange
    const { sut } = makeSut()
  
    //act
    const result = sut.execute('invalid_transactio_id', updateTransactionParams)
  
    //assert
    await expect(result).rejects.toThrow(BadRequest)
  })

  it('Should throw ZodError instance error if amount provided is invalid', async () => {
    //arrange
    const { sut } = makeSut()
    
   
    //act
    //@ts-expect-error
    const result = sut.execute(transactionIdParams, {...updateTransactionParams, amount: 'invalid_amount'})

    //assert
    await expect(result).rejects.toThrow(ZodError)
  })

  it('Should throw ZodError instance error if provided date is invalid', async () => {
    //arrange
    const {sut} = makeSut()

    //act
    //@ts-expect-error
    const result = sut.execute(transactionIdParams, {...updateTransactionParams, date: 'aa'})

    //assert
    await expect(result).rejects.toThrow(ZodError)
  })

  it('Should throw ZodError instance error if provided type is not valid', async () => {
    //arrange
    const { sut } = makeSut()
  
    //act
    //@ts-expect-error
    const result = sut.execute(transactionIdParams, {...updateTransactionParams, type: 'invalid_type'})
  
    //assert
    await expect(result).rejects.toThrow(ZodError)
  })

  it('Should return NotFound instance error if transaction not found', async ()=> {
    //arrange
    const {sut, updateTransactionServiceStub} = makeSut()

    jest.spyOn(updateTransactionServiceStub, 'execute').mockImplementationOnce(() => {
      throw new NotFound()
    })

    //act
    const result = sut.execute(transactionIdParams, updateTransactionParams)

    //assert
    await expect(result).rejects.toThrow(NotFound)
  })

  it('Should return ServerError instance error if unknown error occur', async () => {
    //arrange
    const {sut, updateTransactionServiceStub} = makeSut()
  
    jest.spyOn(updateTransactionServiceStub, 'execute').mockImplementationOnce(()=> {
      throw new ServerError()
    })

    //act
    const result = sut.execute(transactionIdParams, updateTransactionParams)

    //asert
    expect(result).rejects.toThrow(ServerError)
  })

  it('Should UpdateTransactionController with correct params', async () => {
    //arrange
    const { sut, updateTransactionServiceStub } = makeSut()
  
    const executeSpy = jest.spyOn(updateTransactionServiceStub, 'execute')

    //act
    await sut.execute(transactionIdParams, updateTransactionParams)

    //assert
    expect(executeSpy).toHaveBeenCalledWith(transactionIdParams, {...updateTransactionParams, amount: updateTransactionParams.amount * 100})
  })
})