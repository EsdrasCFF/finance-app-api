import { User } from "@prisma/client";
import { IDeleteUserRepository } from "../../repositories/user/delete-user";
import { IGetUserByIdRepository } from "../../repositories/user/get-user-by-id";
import { NotFound } from "../../routes/_errors/not-found";

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