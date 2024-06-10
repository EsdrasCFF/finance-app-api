import { User } from "@prisma/client";
import { IDeleteUserRepository } from "../repositories/delete-user";
import { NotFound } from "../routes/_errors/not-found";

export interface IDeleteUserService {
  execute(userId: string): Promise<User>
}

export class DeleteUserService implements IDeleteUserService {
  constructor(private deleteUserRepository: IDeleteUserRepository) {}

  async execute(userId: string) {
    const deletedUser = await this.deleteUserRepository.execute(userId)

    if(!deletedUser) {
      throw new NotFound('User not found to delete')
    }

    return deletedUser
  }
  
}