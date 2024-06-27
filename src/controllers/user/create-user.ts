import { User } from "@prisma/client";

import { ICreateUserService } from "../../services/user/create-user";
import { createUserSchema } from "../../routes/users/create-user";


interface ICreateUserController {
  execute(createUserParams: Omit<User, "id">): Promise<Omit<User, "password">>;
}

export class CreateUserController implements ICreateUserController {
  constructor(
    private createUserService: ICreateUserService
  ) {}

  async execute(createUserParams: Omit<User, "id">) {

    createUserSchema.parse(createUserParams)

    const { email, first_name, last_name, password } = createUserParams;

    const result = await this.createUserService.execute({
      first_name,
      last_name,
      email,
      password,
    });

    const user = {
      id: result.id,
      first_name: result.first_name,
      last_name: result.last_name,
      email: result.email,
    };

    return user;
  }
}
