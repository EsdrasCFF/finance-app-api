import fastify from "fastify";
import {
  ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { CreateUserController } from "./controllers/create-user";
import z from "zod";
import { createUser } from "./routes/create-user";
import { errorHandler } from "./error-handler";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createUser);

app.setErrorHandler(errorHandler);

app.listen({ port: 3333 }, () => console.log("Server is running on Port"));
