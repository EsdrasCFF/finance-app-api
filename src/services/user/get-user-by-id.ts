import { User } from '@prisma/client'
import { IGetUserByIdRepository } from '../../repositories/user/get-user-by-id'

export interface IGetUserByIdService {
  execute(userId: string): Promise<User | null>
}

export class GetUserByIdService implements IGetUserByIdService {
  constructor(private getUserByIdRepository: IGetUserByIdRepository) {}

  async execute(userId: string) {
    const user = await this.getUserByIdRepository.execute(userId)

    return user
  }
}
