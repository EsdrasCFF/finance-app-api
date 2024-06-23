import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { makeCreateUserController } from "../../factories/controllers/users";


export const createUserSchema = z.object({
  first_name: z.string({required_error: 'First name is required!'})
    .trim()
    .min(3, {message: 'First name is required!'}),
  last_name: z.string({required_error: 'Last name is required!'})
    .trim()
    .min(3, {message: 'Last name is required!'}),
  email: z.string({required_error: 'Email is required!'})
    .email({ message: "Invalid e-mail. Please provide a valid e-mail" }),
  password: z.string({required_error: 'Password is required!'})
    .trim()
    .min(6, { message: "Password must be greater or equal 6 characters" }),
});

export async function createUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/api/users",
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
      const createUserParams = request.body;

      const createUserController = makeCreateUserController()

      const result = await createUserController.execute(createUserParams);

      return reply.code(201).send({
        data: result,
      });
    }
  );
}
