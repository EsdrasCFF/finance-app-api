
import { PasswordComparatorAdapter } from "../../adapters/password-comparator";
import { PasswordHasherAdapter } from "../../adapters/password-hasher";
import { CreateUserController } from "../../controllers/user/create-user";
import { DeleteUserController } from "../../controllers/user/delete-user";
import { GetUserBalanceController } from "../../controllers/user/get-user-balance";
import { GetUserByIdController } from "../../controllers/user/get-user-by-id";
import { UpdateUserController } from "../../controllers/user/update-user";
import { CreateUserRepository } from "../../repositories/user/create-users";
import { DeleteUserRepository } from "../../repositories/user/delete-user";
import { GetUserBalanceRepository } from "../../repositories/user/get-user-balance";
import { GetUserByEmailRepository } from "../../repositories/user/get-user-by-email";
import { GetUserByIdRepository } from "../../repositories/user/get-user-by-id";
import { UpdateUserRepository } from "../../repositories/user/update-user";
import { CreateUserService } from "../../services/user/create-user";
import { DeleteUserService } from "../../services/user/delete-user";
import { GetUserBalanceService } from "../../services/user/get-user-balance";
import { GetUserByEmailService } from "../../services/user/get-user-by-email";
import { GetUserByIdService } from "../../services/user/get-user-by-id";
import { UpdateUserService } from "../../services/user/update-user";

export function makeGetUserByIdController() {
  const getUserByIdRepository = new GetUserByIdRepository()
  const getUserByIdService = new GetUserByIdService(getUserByIdRepository)
  const getUserByIdController = new GetUserByIdController(getUserByIdService);

  return getUserByIdController
} 

export function makeCreateUserController() {
  const createUserRepository = new CreateUserRepository();
  const getUserByEmailRepository = new GetUserByEmailRepository();

  const passwordHasherAdapter = new PasswordHasherAdapter()

  const createUserService = new CreateUserService(createUserRepository, getUserByEmailRepository, passwordHasherAdapter);

  const createUserController = new CreateUserController(createUserService);

  return createUserController
}

export function makeDeleteUserController() {
  const deleteUserRepository = new DeleteUserRepository()
  const getUserByIdRepository = new GetUserByIdRepository()

  const deleteUserService = new DeleteUserService(deleteUserRepository, getUserByIdRepository)
  
  const deleteUserController = new DeleteUserController(deleteUserService)

  return deleteUserController
}

export function makeUpdateUserController() {
  const updateUserRepository = new UpdateUserRepository()
  const getUserByIdRepository = new GetUserByIdRepository()
  const getUserByEmailRepository = new GetUserByEmailRepository()

  const passwordComparatorAdapter = new PasswordComparatorAdapter()
  const passwordHasherAdapter = new PasswordHasherAdapter()

  const updateUserService = new UpdateUserService(
    getUserByIdRepository, 
    getUserByEmailRepository,
    updateUserRepository, 
    passwordComparatorAdapter, 
    passwordHasherAdapter
  )

  const updateUserController = new UpdateUserController(updateUserService);

  return updateUserController
}

export function makeGetUserBalanceController() {
  const getUserBalanceRepository = new GetUserBalanceRepository()
  const getUserByIdRepository = new GetUserByIdRepository()
  
  const getUserBalanceService = new GetUserBalanceService(getUserBalanceRepository, getUserByIdRepository)

  const getUserBalanceController = new GetUserBalanceController(getUserBalanceService)

  return getUserBalanceController
}