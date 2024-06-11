import fastify from "fastify";
import {
  ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { createUser } from "./routes/users/create-user";
import { errorHandler } from "./error-handler";
import { getUserById } from "./routes/users/get-user-by-id";
import { updateUser } from "./routes/users/update-user";
import { deleteUser } from "./routes/users/delete-user";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createUser);
app.register(getUserById);
app.register(updateUser);
app.register(deleteUser)

app.setErrorHandler(errorHandler);

app.listen({ port: 3333 }, () =>
  console.log("Server is running on Port: 3333")
);
