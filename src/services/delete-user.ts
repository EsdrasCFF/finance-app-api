import { User } from "@prisma/client";
import { IDeleteUserRepository } from "../repositories/delete-user";
import { NotFound } from "../routes/_errors/not-found";
import { IGetUserByIdRepository } from "../repositories/get-user-by-id";

export interface IDeleteUserService {
  execute(userId: string): Promise<User>
}

export class DeleteUserService implements IDeleteUserService {
  constructor(
    private deleteUserRepository: IDeleteUserRepository,
    private getUserByIdRepository: IGetUserByIdRepository
  ) {}

  async execute(userId: string) {

    const userExists = await this.getUserByIdRepository.execute(userId)

    if(!userExists) {
      throw new NotFound('User not found!')
    }

    const deletedUser = await this.deleteUserRepository.execute(userExists.id)

    return deletedUser
  }
  
}