import fastify from 'fastify'
import supertest from 'supertest'
import { createUser } from '../../../routes/users/create-user'
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
      .set('Content-Type', 'application/json')
      .send(createUserParams)
      
    expect(response.status).toBe(201)
  })
})