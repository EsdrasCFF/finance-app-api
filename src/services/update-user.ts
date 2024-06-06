import { GetUserByEmailRepository } from "../repositories/get-user-by-email";
import { UpdateUserRepository } from "../repositories/update-user";
import { BadRequest } from "../routes/_errors/bad-request";
import bcrypt from "bcrypt";
import { NotFound } from "../routes/_errors/not-found";

interface UpdateUserProps {
  first_name: string;
  last_name: string;
  email: string;
  old_password: string;
  new_password: string | null;
}

export class UpdateUserService {
  async execute(userId: string, updateUserParams: UpdateUserProps) {
    const getUserByEmailRepository = new GetUserByEmailRepository();
    const user = await getUserByEmailRepository.execute(updateUserParams.email);

    if (!user) {
      return;
    }

    if (user.id !== userId) {
      throw new BadRequest("This email is already in use");
    }

    let password;

    if (updateUserParams.new_password) {
      password = await bcrypt.hash(updateUserParams.new_password, 10);
    } else {
      password = user.password;
    }

    const userParams = {
      ...updateUserParams,
      password,
    };

    const updatedUserRepository = new UpdateUserRepository();
    const updatedUser = await updatedUserRepository.execute(userId, userParams);

    return updatedUser;
  }
}
