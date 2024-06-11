import { User } from "@prisma/client";
import validator from "validator";
import { BadRequest } from "../routes/_errors/bad-request";
import { IDeleteUserService } from "../services/user/delete-user";

export interface IDeleteUserController {
  execute(userId: string): Promise<User>
}

export class DeleteUserController implements IDeleteUserController {

  constructor(private deleteUserService: IDeleteUserService) {}

  async execute(userId: string) {
    const idIsValid = validator.isUUID(userId)

    if(!idIsValid) {
      throw new BadRequest('Provided UserId is not valid!')
    }

    const deletedUser = await this.deleteUserService.execute(userId)

    return deletedUser
  }
}