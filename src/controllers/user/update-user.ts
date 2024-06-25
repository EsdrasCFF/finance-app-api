import validator from "validator";
import { User } from "@prisma/client";
import { IUpdateUserService } from "../../services/user/update-user";
import { BadRequest } from "../../routes/_errors/bad-request";
import { updatedUserSchema } from "../../routes/users/update-user";

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

   updatedUserSchema.parse(updateUserParams)

    const userIdIsValid = validator.isUUID(userId);

    if (!userIdIsValid) {
      throw new BadRequest("UserId provided is not valid!");
    }

    const updatedSucessfully = await this.updateUserService.execute(
      userId,
      updateUserParams
    );

    const { password, ...otherProps } = updatedSucessfully;

    return otherProps;
  }
}
