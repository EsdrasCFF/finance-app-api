import validator from 'validator'
import { User } from '@prisma/client'
import { BadRequest } from '../../routes/_errors/bad-request'
import { NotFound } from '../../routes/_errors/not-found'
import { IGetUserByIdService } from '../../services/user/get-user-by-id'

interface IGetUserByIdController {
  execute(userId: string): Promise<Omit<User, 'password'>>
}

export class GetUserByIdController implements IGetUserByIdController {
  constructor(private getUserByIdService: IGetUserByIdService) {}

  async execute(userId: string) {
    const isValidUserId = validator.isUUID(userId)

    if (!isValidUserId) {
      throw new BadRequest('Provided Id is not valid!')
    }

    const user = await this.getUserByIdService.execute(userId)

    if (!user) {
      throw new NotFound('User not found!')
    }

    const userData = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name
    }

    return userData
  }
}
