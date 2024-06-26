import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { makeUpdateUserController } from "../../factories/controllers/users";

export const updatedUserSchema = z.object({
  first_name: z.string().trim().min(3, {message: 'Provide a correct first name'}).nullable().optional(),
  last_name: z.string().trim().min(3, {message: 'Provide a correct last name'}).nullable().optional(),
  email: z.string().email().nullable().optional(),
  password: z
    .string()
    .min(6, { message: "Password must be greater or equal 6 characters" })
    .nullable()
    .optional(),
  old_password: z.string().nullable().optional(),
})
  .strict({message: 'Some provided field is not allowed!'})

export async function updateUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch(
    "/api/users/:userId",
    {
      schema: {
        params: z.object({
          userId: z.string().uuid({ message: "Userid provided is not valid" }),
        }),
        body: updatedUserSchema,
        response: {
          200: z.object({
            data: z.object({
              id: z.string(),
              first_name: z.string(),
              last_name: z.string(),
              email: z.string(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { first_name, last_name, email, password, old_password } = request.body;
      const { userId } = request.params;

      const updateUserController = makeUpdateUserController()

      const user = await updateUserController.execute(userId, {
        first_name: first_name || null,
        last_name: last_name || null,
        email: email || null,
        password: password || null,
        old_password: old_password || null,
      });

      return reply.code(200).send({ data: user });
    }
  );
}
