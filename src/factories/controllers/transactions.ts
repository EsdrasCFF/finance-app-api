import { CreateTransactionController } from "../../controllers/transaction/create-transaction";
import { CreateTransactionRepository } from "../../repositories/transaction/create-transaction";
import { GetUserByIdRepository } from "../../repositories/user/get-user-by-id";
import { CreateTransactionService } from "../../services/transaction/create-transaction";

export function makeCreateTransactionController() {
  const createTransactionRepository = new CreateTransactionRepository()
  const getUserByIdRepository = new GetUserByIdRepository()

  const createTransactionService = new CreateTransactionService(createTransactionRepository, getUserByIdRepository)
  const createTransactionController = new CreateTransactionController(createTransactionService)

  return createTransactionController
} 