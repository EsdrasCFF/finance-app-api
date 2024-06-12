import { CreateTransactionController } from "../../controllers/transaction/create-transaction";
import { GetTransactionsByUserIdController } from "../../controllers/transaction/get-transactions-by-userId";
import { CreateTransactionRepository } from "../../repositories/transaction/create-transaction";
import { GetTransactionsByUserIdRepository } from "../../repositories/transaction/get-transactions-by-userId";
import { GetUserByIdRepository } from "../../repositories/user/get-user-by-id";
import { CreateTransactionService } from "../../services/transaction/create-transaction";
import { GetTransactionsByUserIdService } from "../../services/transaction/get-transactions-by-userId";

export function makeCreateTransactionController() {
  const createTransactionRepository = new CreateTransactionRepository()
  const getUserByIdRepository = new GetUserByIdRepository()

  const createTransactionService = new CreateTransactionService(createTransactionRepository, getUserByIdRepository)
  const createTransactionController = new CreateTransactionController(createTransactionService)

  return createTransactionController
} 


export function makeGetTransactionsByUserIdController() {
  const getTransactionsByUserIdRepository = new GetTransactionsByUserIdRepository()
  const getUserByIdRepository = new GetUserByIdRepository()

  const getTransactionsByUserIdService = new GetTransactionsByUserIdService(getTransactionsByUserIdRepository, getUserByIdRepository)

  const getTransactionsByUserIdController = new GetTransactionsByUserIdController(getTransactionsByUserIdService)

  return getTransactionsByUserIdController
}