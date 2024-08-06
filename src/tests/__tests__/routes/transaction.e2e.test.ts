import supertest from "supertest"
import { app } from '../../../server'
import { createUserParams } from "../../fixtures/user"
import { createTransactionParams, updateTransactionParams } from "../../fixtures/transaction"

describe('Transactions Routes E2E Tests', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('POST /transacions should return 201 when transacion is created', async () => {
    const createdUserRoute = await supertest(app.server)
      .post('/api/users')
      .send(createUserParams)
    

    const userId = createdUserRoute.body.data.id
    const response = await supertest(app.server)
      .post('/api/transactions')
      .send({
        ...createTransactionParams,
        user_id: userId
      })
    
    expect(response.body.data.user_id).toEqual(userId)
    expect(response.status).toBe(201)
  })

  it('DELETE /transactions should return 200 when transaction is deleted', async () => {
    const createdUserRoute = await supertest(app.server)
      .post('/api/users')
      .send(createUserParams)
    
    const userId = createdUserRoute.body.data.id
  
    const createTransactionRoute = await supertest(app.server)
      .post('/api/transactions')
      .send({
        ...createTransactionParams,
        user_id: userId
      })
    
    const transactionId = createTransactionRoute.body.data.id

    const response = await supertest(app.server)
      .delete(`/api/transactions/${transactionId}`)
  
      
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('data')
    expect(response.body.data.id).toEqual(transactionId)
    expect(response.body.data.user_id).toBe(userId)
  })

  it('GET /transactions?userId=user_id return 200 when transactions are found', async () => {
    const createdUserRoute = await supertest(app.server)
      .post('/api/users')
      .send(createUserParams)
    
    const userId = createdUserRoute.body.data.id
  
    const createTransactionRoute = await supertest(app.server)
      .post('/api/transactions')
      .send({
        ...createTransactionParams,
        user_id: userId
      })
    
    const response = await supertest(app.server)
      .get(`/api/transactions?userId=${userId}`)
    
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('data')
  })

  it('PATCH /transactions/transactionId return 200 when transaction is updated', async () => {
    const createdUserRoute = await supertest(app.server)
      .post('/api/users')
      .send(createUserParams)
    
    const userId = createdUserRoute.body.data.id
    
    const createTransactionRoute = await supertest(app.server)
      .post('/api/transactions')
      .send({
        ...createTransactionParams,
        user_id: userId
      })
    
    const transactionId = createTransactionRoute.body.data.id

    const response = await supertest(app.server)
      .patch(`/api/transactions/${transactionId}`)
      .send({
        ...updateTransactionParams,
        amount: 200
      })
  
    expect(response.status).toBe(200)
    expect(response.body.data.amount).toBe(200)
  })
})