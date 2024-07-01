import { db } from './src/lib/prisma'

beforeEach(async () => {
  await db.user.deleteMany({})
  await db.transaction.deleteMany({})
})