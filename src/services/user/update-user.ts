import { User } from '@prisma/client'
import { IGetUserByEmailRepository } from '../../repositories/user/get-user-by-email'
import { IGetUserByIdRepository } from '../../repositories/user/get-user-by-id'
import { IUpdateUserRepository } from '../../repositories/user/update-user'
import { BadRequest } from '../../routes/_errors/bad-request'
import { IPasswordComparatorAdapter } from '../../adapters/password-comparator'
import { IPasswordHasherAdapter } from '../../adapters/password-hasher'

export interface IUpdateUserService {
  execute(userId: string, updateUserParams: UpdateUserProps): Promise<User>
}

export interface UpdateUserProps {
  first_name: string | null
  last_name: string | null
  email: string | null
  old_password: string | null
  password: string | null
}

export class UpdateUserService implements IUpdateUserService {
  constructor(
    private getUserByIdRepository: IGetUserByIdRepository,
    private getUserByEmailRepository: IGetUserByEmailRepository,
    private updateUserRepository: IUpdateUserRepository,
    private passwordComparatorAdapter: IPasswordComparatorAdapter,
    private passwordHasherAdapter: IPasswordHasherAdapter
  ) {}

  async execute(userId: string, updateUserParams: UpdateUserProps) {
    const {
      email,
      first_name,
      last_name,
      old_password,
      password: new_password
    } = updateUserParams

    const userData = await this.getUserByIdRepository.execute(userId)

    if (!userData) {
      throw new BadRequest('UserId provided is incorrect')
    }

    const userDataByEmail = email
      ? await this.getUserByEmailRepository.execute(email)
      : null

    if (userDataByEmail) {
      if (userDataByEmail.id !== userId) {
        throw new BadRequest('This email already in use')
      }
    }

    let password: string

    if (new_password && !old_password) {
      throw new BadRequest('Old password is required to change pass')
    }

    if (new_password && old_password) {
      const checkedOldPass = await this.passwordComparatorAdapter.execute(
        old_password,
        userData.password
      )

      if (!checkedOldPass) {
        throw new BadRequest('Old password does not match!')
      }

      password = await this.passwordHasherAdapter.execute(new_password)
    } else {
      password = userData.password
    }

    const fisrtName = first_name ? first_name : userData.first_name
    const lastName = last_name ? last_name : userData.last_name
    const emailToUpdate = email || userData.email

    const userParams = {
      first_name: fisrtName,
      last_name: lastName,
      email: emailToUpdate,
      password
    }

    const updatedUser = await this.updateUserRepository.execute(
      userId,
      userParams
    )

    return updatedUser
  }
}
