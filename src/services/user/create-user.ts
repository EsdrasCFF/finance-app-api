import { User } from '@prisma/client'
import { ICreateUserRepository } from '../../repositories/user/create-users'
import { IGetUserByEmailRepository } from '../../repositories/user/get-user-by-email'
import { BadRequest } from '../../routes/_errors/bad-request'
import { IPasswordHasherAdapter } from '../../adapters/password-hasher'

export interface ICreateUserService {
  execute(crateUserParams: Omit<User, 'id'>): Promise<User>
}

export class CreateUserService implements ICreateUserService {
  constructor(
    private createUserRepository: ICreateUserRepository,
    private getUserByEmailRepositoty: IGetUserByEmailRepository,
    private passwordHasherAdapter: IPasswordHasherAdapter
  ) {}

  async execute(createUserParams: Omit<User, 'id'>) {
    const emailAlreadyInUse = await this.getUserByEmailRepositoty.execute(
      createUserParams.email
    )

    if (emailAlreadyInUse) {
      throw new BadRequest('Email already in use!')
    }

    const hashedPassword = await this.passwordHasherAdapter.execute(
      createUserParams.password
    )

    const user = {
      ...createUserParams,
      password: hashedPassword
    }

    const createdUser = await this.createUserRepository.execute(user)

    return createdUser
  }
}
