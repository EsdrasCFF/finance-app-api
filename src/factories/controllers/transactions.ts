import { CreateTransactionController } from '../../controllers/transaction/create-transaction'
import { DeleteTransactionController } from '../../controllers/transaction/delete-transaction'
import { GetTransactionsByUserIdController } from '../../controllers/transaction/get-transactions-by-userId'
import { UpdateTransactionController } from '../../controllers/transaction/update-transaction'
import { CreateTransactionRepository } from '../../repositories/transaction/create-transaction'
import { DeleteTransactionRepository } from '../../repositories/transaction/delete-transaction'
import { GetTransactionByIdRepository } from '../../repositories/transaction/get-transaction-by-id'
import { GetTransactionsByUserIdRepository } from '../../repositories/transaction/get-transactions-by-userId'
import { UpdateTransactionRepository } from '../../repositories/transaction/update-transactions'
import { GetUserByIdRepository } from '../../repositories/user/get-user-by-id'
import { CreateTransactionService } from '../../services/transaction/create-transaction'
import { DeleteTransactionService } from '../../services/transaction/delete-transaction'
import { GetTransactionsByUserIdService } from '../../services/transaction/get-transactions-by-userId'
import { UpdateTransactionService } from '../../services/transaction/update-transaction'

export function makeCreateTransactionController() {
  const createTransactionRepository = new CreateTransactionRepository()
  const getUserByIdRepository = new GetUserByIdRepository()

  const createTransactionService = new CreateTransactionService(
    createTransactionRepository,
    getUserByIdRepository
  )
  const createTransactionController = new CreateTransactionController(
    createTransactionService
  )

  return createTransactionController
}

export function makeGetTransactionsByUserIdController() {
  const getTransactionsByUserIdRepository =
    new GetTransactionsByUserIdRepository()
  const getUserByIdRepository = new GetUserByIdRepository()

  const getTransactionsByUserIdService = new GetTransactionsByUserIdService(
    getTransactionsByUserIdRepository,
    getUserByIdRepository
  )

  const getTransactionsByUserIdController =
    new GetTransactionsByUserIdController(getTransactionsByUserIdService)

  return getTransactionsByUserIdController
}

export function makeUpdateTransactionController() {
  const updateTransactionRepository = new UpdateTransactionRepository()
  const getTransactionById = new GetTransactionByIdRepository()

  const updateTransactionService = new UpdateTransactionService(
    updateTransactionRepository,
    getTransactionById
  )

  const updateTransactionController = new UpdateTransactionController(
    updateTransactionService
  )

  return updateTransactionController
}

export function makeDeleteTransactionController() {
  const deleteTransactionRepository = new DeleteTransactionRepository()
  const getTransactionByIdRepository = new GetTransactionByIdRepository()

  const deleteTransactionService = new DeleteTransactionService(
    deleteTransactionRepository,
    getTransactionByIdRepository
  )
  const deleteTransactionController = new DeleteTransactionController(
    deleteTransactionService
  )

  return deleteTransactionController
}
