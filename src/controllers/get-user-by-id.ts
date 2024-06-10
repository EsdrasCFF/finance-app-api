import validator from "validator";
import { NotFound } from "../routes/_errors/not-found";
import { ServerError } from "../routes/_errors/server-error";
import { GetUserByIdService, IGetUserByIdService } from "../services/get-user-by-id";
import { BadRequest } from "../routes/_errors/bad-request";
import { User } from "@prisma/client";

interface IGetUserByIdController {
  execute(userId: string): Promise<Omit<User, 'password'>>
}

export class GetUserByIdController implements IGetUserByIdController {
  constructor(private getUserByIdService: IGetUserByIdService) {}

  async execute(userId: string) {
    const isValidUserId = validator.isUUID(userId);

    if (!isValidUserId) {
      throw new BadRequest("Provided Id is not valid!");
    }

    const user = await this.getUserByIdService.execute(userId);

    if (!user) {
      throw new NotFound("User not found!");
    }

    const { password, ...otherProps } = user;

    return otherProps;
  }
}
