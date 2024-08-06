import bcrypt from 'bcrypt'

export interface IPasswordHasherAdapter {
  execute(password: string): Promise<string>
}

export class PasswordHasherAdapter implements IPasswordHasherAdapter {
  async execute(password: string) {
    const passwordHashed = await bcrypt.hash(password, 9)

    return passwordHashed
  }
}
