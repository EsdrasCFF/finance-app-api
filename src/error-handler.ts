import { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { BadRequest } from "./routes/_errors/bad-request";
import { NotFound } from "./routes/_errors/not-found";
import { ServerError } from "./routes/_errors/server-error";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = (error, request, response) => {
  if (error instanceof ZodError) {
    return response.status(400).send({
      message: "Error during validation",
      errors: error.flatten().fieldErrors,
    });
  }

  if (error instanceof BadRequest) {
    return response.status(400).send({
      message: error.message,
    });
  }

  if (error instanceof NotFound) {
    return response.status(404).send({
      message: error.message,
    });
  }

  if (error instanceof ServerError) {
    console.error("Error:", error.message)
    return response.status(500).send({
      message: "Internal server error",
    });
  }

  return response.status(500).send({ message: "Internal server error" });
};
