import fastify from "fastify";
import {
  ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { createUser } from "./routes/create-user";
import { errorHandler } from "./error-handler";
import { getUserById } from "./routes/get-user-by-id";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createUser);
app.register(getUserById);

app.setErrorHandler(errorHandler);

app.listen({ port: 3333 }, () =>
  console.log("Server is running on Port: 3333")
);
