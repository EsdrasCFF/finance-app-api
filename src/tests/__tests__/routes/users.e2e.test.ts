import fastify from 'fastify'
import supertest from 'supertest'
import { createUserParams } from '../../fixtures/user'
import { app } from '../../../server'

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

  it('POST /users should return 201 when user is created', async () => {
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
})