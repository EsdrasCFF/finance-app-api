import { db } from './src/lib/prisma'

beforeEach(async () => {
  await db.transaction.deleteMany({})
  await db.user.deleteMany({})
})