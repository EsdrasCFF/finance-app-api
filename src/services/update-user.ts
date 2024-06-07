import { GetUserByEmailRepository } from "../repositories/get-user-by-email";
import { UpdateUserRepository } from "../repositories/update-user";
import { BadRequest } from "../routes/_errors/bad-request";
import bcrypt from "bcrypt";
import { NotFound } from "../routes/_errors/not-found";
import { GetUserByIdRepository } from "../repositories/get-user-by-id";

interface UpdateUserProps {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  old_password: string | null;
  password: string | null;
}

export class UpdateUserService {
  async execute(userId: string, updateUserParams: UpdateUserProps) {
    const {
      email,
      first_name,
      last_name,
      old_password,
      password: new_password,
    } = updateUserParams;

    const getUserByIdRepository = new GetUserByIdRepository();
    const getUserByEmailRepository = new GetUserByEmailRepository();

    const userData = await getUserByIdRepository.execute(userId);

    if (!userData) {
      throw new BadRequest("UserId provided is incorrect");
    }

    const userDataByEmail = !!email
      ? await getUserByEmailRepository.execute(email)
      : null;

    if (userDataByEmail) {
      if (userDataByEmail.id !== userId) {
        throw new BadRequest("This email already in use");
      }
    }

    let password: string;

    if (new_password && !old_password) {
      throw new BadRequest("Old password is required to change pass");
    }

    if (new_password) {
      const checkedOldPass = await bcrypt.compare(
        new_password,
        userData.password
      );

      if (!checkedOldPass) {
        throw new BadRequest("Old password does not match!");
      }

      password = await bcrypt.hash(new_password, 10);
    } else {
      password = userData.password;
    }

    const fisrtName = first_name ? first_name : userData.first_name;
    const lastName = last_name ? last_name : userData.last_name;
    const emailToUpdate = email || userData.email;

    const userParams = {
      first_name: fisrtName,
      last_name: lastName,
      email: emailToUpdate,
      password,
    };

    const updatedUserRepository = new UpdateUserRepository();
    const updatedUser = await updatedUserRepository.execute(userId, userParams);

    return updatedUser;
  }
}
