import bcrypt from 'bcrypt'

export interface IPasswordComparatorAdapter {
  execute(
    old_password: string,
    encrypted_old_password: string
  ): Promise<boolean>
}

export class PasswordComparatorAdapter implements IPasswordComparatorAdapter {
  async execute(old_password: string, encrypted_old_password: string) {
    const passwordCompare = await bcrypt.compare(
      old_password,
      encrypted_old_password
    )

    return passwordCompare
  }
}
