import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { CreateUserController } from "../controllers/create-user";

export const createUserSchema = z.object({
  first_name: z.string().trim(),
  last_name: z.string().trim(),
  email: z.string().email(),
  password: z.string(),
});

export async function createUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/api/user",
    {
      schema: {
        body: createUserSchema,
        response: {
          201: z.object({
            data: z.object({
              id: z.string().uuid(),
              first_name: z.string(),
              last_name: z.string(),
              email: z.string(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const createUserController = new CreateUserController();

      const result = await createUserController.execute(request.body);

      return reply.code(201).send({
        data: result,
      });
    }
  );
}
