import { CreateUserController } from "../../controllers/create-user";
import { DeleteUserController } from "../../controllers/delete-user";
import { GetUserByIdController } from "../../controllers/get-user-by-id";
import { UpdateUserController } from "../../controllers/update-user";
import { CreateUserRepository } from "../../repositories/user/create-users";
import { DeleteUserRepository } from "../../repositories/user/delete-user";
import { GetUserByEmailRepository } from "../../repositories/user/get-user-by-email";
import { GetUserByIdRepository } from "../../repositories/user/get-user-by-id";
import { UpdateUserRepository } from "../../repositories/user/update-user";
import { CreateUserService } from "../../services/create-user";
import { DeleteUserService } from "../../services/delete-user";
import { GetUserByEmailService } from "../../services/get-user-by-email";
import { GetUserByIdService } from "../../services/get-user-by-id";
import { UpdateUserService } from "../../services/update-user";

export function makeGetUserByIdController() {
  const getUserByIdRepository = new GetUserByIdRepository()
  const getUserByIdService = new GetUserByIdService(getUserByIdRepository)
  const getUserByIdController = new GetUserByIdController(getUserByIdService);

  return getUserByIdController
} 

export function makeCreateUserController() {
  const createUserRepository = new CreateUserRepository();
  const getUserByEmailRepository = new GetUserByEmailRepository();

  const createUserService = new CreateUserService(createUserRepository);
  const getUserByEmailService = new GetUserByEmailService(getUserByEmailRepository);

  const createUserController = new CreateUserController(
    createUserService,
    getUserByEmailService
  );

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

  const updateUserService = new UpdateUserService(getUserByIdRepository, getUserByEmailRepository,updateUserRepository)

  const updateUserController = new UpdateUserController(updateUserService);

  return updateUserController
}