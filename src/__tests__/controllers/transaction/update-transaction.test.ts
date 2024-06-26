import { faker } from "@faker-js/faker"
import { IUpdateTransactionService } from "../../../services/transaction/update-transaction"
import { $Enums, TRANSACTION_TYPE } from "@prisma/client"
import { UpdateTransactionController } from "../../../controllers/transaction/update-transaction";

type TransactionParams = {
  name: string;
  description: string;
  amount: number;
  type: $Enums.TRANSACTION_TYPE;
  date: Date;
}

describe('UpdateTransactionController', () => {
  
  const transactionIdParams = faker.string.uuid()
  
  const updateTransactionParams = {
    name: faker.commerce.product.name[1],
    description: faker.commerce.product.name[0],
    amount: faker.number.int(),
    type: 'INCOME' as TRANSACTION_TYPE,
    date: faker.date.recent(),
  }

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

})