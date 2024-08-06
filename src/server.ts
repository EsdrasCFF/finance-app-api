import fastify from 'fastify'
import {
  ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform
} from 'fastify-type-provider-zod'
import { createUser } from './routes/users/create-user'
import { errorHandler } from './error-handler'
import { getUserById } from './routes/users/get-user-by-id'
import { updateUser } from './routes/users/update-user'
import { deleteUser } from './routes/users/delete-user'
import { createTransaction } from './routes/transactions/create-transaction'
import { getTransactions } from './routes/transactions/get-transactions'
import { updateTransaction } from './routes/transactions/update-transaction'
import { getUserBalance } from './routes/users/get-user-balance'
import { deleteTransaction } from './routes/transactions/delete-transaction'

import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import fastifyCors from '@fastify/cors'

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, {
  origin: '*'
})

app.register(fastifySwagger, {
  swagger: {
    consumes: ['application/json'],
    produces: ['application/json'],
    info: {
      title: 'finance-api',
      description:
        'Especificações da FinanceAPI, beckend da aplicação FinanceAPP, feita para gerenciar as financas',
      version: '2.0.0'
    }
  },
  transform: jsonSchemaTransform
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs'
})

app.register(createUser)
app.register(getUserById)
app.register(updateUser)
app.register(deleteUser)
app.register(getUserBalance)

app.register(createTransaction)
app.register(getTransactions)
app.register(updateTransaction)
app.register(deleteTransaction)

app.setErrorHandler(errorHandler)

app
  .listen({ port: 3333, host: '0.0.0.0' })
  .then(() => {
    console.log('Server is running:', 3333)
  })
  .catch((e) => {
    console.log('Error:', e)
  })
