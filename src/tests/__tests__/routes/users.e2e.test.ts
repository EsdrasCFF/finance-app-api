import supertest from 'supertest'
import { createUserParams, updateUserParams } from '../../fixtures/user'
import { app } from '../../../server'
import { createTransactionParams } from '../../fixtures/transaction'

describe('User Routes E2E Tests', () => {

  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('POST /users should return 201 when user is created', async () => {
    const response = await supertest(app.server)
      .post('/api/users')
      .send(createUserParams)
      
    expect(response.status).toBe(201)
  })

  it('DELETE /users should return 201 when user is deleted', async () => {
    const createUser = await supertest(app.server)
      .post('/api/users')
      .send({
        ...createUserParams,
        email: 'novoemail@email.com'
      })
      
    const userId = createUser.body.data.id
    const response = await supertest(app.server)
      .delete(`/api/users/${userId}`)
      
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('data')
  })

  it(`GET /users/userId/balance returns 200 when get is successful`, async () => {
    const createUser = await supertest(app.server)
      .post('/api/users')
      .send({
        ...createUserParams,
        email: 'novoemail@email.com'
      })
    
      const userId = createUser.body.data.id
    
    await supertest(app.server)
      .post('/api/transacion')
      .send({
        ...createTransactionParams,
        userId
      })
    
    const response = await supertest(app.server)
    .get(`/api/users/${userId}/balance`)
    
    expect(response.status).toEqual(200)
  })

  it('GET /users/userId returns 200 when get is successfully ', async () => {
    const createUserRoute = await supertest(app.server)
      .post('/api/users')
      .send(createUserParams)
    

    const userId = createUserRoute.body.data.id
    const response = await supertest(app.server)
      .get(`/api/users/${userId}`)
    
    expect(response.status).toBe(200)
  })

  it('PATCH /users/userId return 200 when user is updated' , async () => {
    const createUserRoute = await supertest(app.server)
      .post('/api/users')
      .send(createUserParams)
    
    const userid = createUserRoute.body.data.id

    const response = await supertest(app.server)
      .patch(`/api/users/${userid}`)
      .send({
        ...updateUserParams,
        first_name: 'New Name'
      })
    
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('data')
  })
})