import { User } from '@prisma/client'
import validator from 'validator'
import { IDeleteUserService } from '../../services/user/delete-user'
import { BadRequest } from '../../routes/_errors/bad-request'

export interface IDeleteUserController {
  execute(userId: string): Promise<Omit<User, 'password'>>
}

export class DeleteUserController implements IDeleteUserController {
  constructor(private deleteUserService: IDeleteUserService) {}

  async execute(userId: string) {
    const idIsValid = validator.isUUID(userId)

    if (!idIsValid) {
      throw new BadRequest('Provided UserId is not valid!')
    }

    const deletedUser = await this.deleteUserService.execute(userId)

    return {
      id: deletedUser.id,
      email: deletedUser.email,
      first_name: deletedUser.first_name,
      last_name: deletedUser.last_name
    }
  }
}
