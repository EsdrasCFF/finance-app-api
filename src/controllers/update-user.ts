import validator from "validator";
import { BadRequest } from "../routes/_errors/bad-request";
import { UpdateUserService } from "../services/update-user";

interface UpdateUserProps {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  password: string | null;
  old_password: string | null;
}

export class UpdateUserController {
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

    console.log({ controlleEmai: updateUserParams.email });

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

    const updateUserService = new UpdateUserService();
    const updatedSucessfully = await updateUserService.execute(
      userId,
      updateUserParams
    );

    const { password, ...otherProps } = updatedSucessfully;

    return otherProps;
  }
}
