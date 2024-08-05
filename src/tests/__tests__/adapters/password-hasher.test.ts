import { PasswordHasherAdapter } from "../../../adapters/password-hasher"

describe('Password Hasher Adapter', () => {
  
  const sut = new PasswordHasherAdapter()

  it('Should return password hashed', async () => {
    const result = await sut.execute('123456')

    expect(result).toBeTruthy()
    expect(typeof result).toBe('string')
  })
})