import validator from "validator";
import { User } from "@prisma/client";
import { IUpdateUserService } from "../../services/user/update-user";
import { BadRequest } from "../../routes/_errors/bad-request";

interface UpdateUserProps {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  password: string | null;
  old_password: string | null;
}

interface IUpdateUserController {
  execute(userId: string, updateUserParams: UpdateUserProps): Promise<Omit<User, 'password'>>
}


export class UpdateUserController implements IUpdateUserController {
  constructor(private updateUserService: IUpdateUserService) {}


  async execute(userId: string, updateUserParams: UpdateUserProps) {
    const allowedFields = [
      "first_name",
      "last_name",
      "email",
      "password",
      "old_password",
    ];

    const someFieldNotAllowed = Object.keys(updateUserParams).some(
      (field) => !allowedFields.includes(field)
    );

    if (someFieldNotAllowed) {
      throw new BadRequest("Some field provided is not allowed");
    }

    const userIdIsValid = validator.isUUID(userId);

    if (!userIdIsValid) {
      throw new BadRequest("UserId provided is not valid!");
    }

    if (updateUserParams.password) {
      const passwordIsValid = updateUserParams.password.length > 5;

      if (!passwordIsValid) {
        throw new BadRequest("Password must be greater or then ");
      }
    }

    if (updateUserParams.email) {
      const emailIsValid = validator.isEmail(updateUserParams.email);

      if (!emailIsValid) {
        throw new BadRequest("Email provided is not valid");
      }
    }

    const updatedSucessfully = await this.updateUserService.execute(
      userId,
      updateUserParams
    );

    const { password, ...otherProps } = updatedSucessfully;

    return otherProps;
  }
}
