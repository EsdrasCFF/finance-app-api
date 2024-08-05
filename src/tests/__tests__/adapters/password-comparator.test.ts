import { PasswordComparatorAdapter } from "../../../adapters/password-comparator"

describe('PasswordComparatorAdapter', () => {
  const sut = new PasswordComparatorAdapter()
  
  it('Should return correct validation', async () => {
    const result = await sut.execute('123456', '#123456')

    expect(result).toBeFalsy()
    expect(typeof result).toBe('boolean')
  })
})