import validator from "validator";
import { NotFound } from "../routes/_errors/not-found";
import { ServerError } from "../routes/_errors/server-error";
import { GetUserByIdService } from "../services/get-user-by-id";
import { BadRequest } from "../routes/_errors/bad-request";

export class GetUserByIdController {
  async execute(userId: string) {
    try {
      const isValidUserId = validator.isUUID(userId);

      if (!isValidUserId) {
        throw new BadRequest("Provider Id is not valid!");
      }

      const getUserByIdService = new GetUserByIdService();

      const user = await getUserByIdService.execute(userId);

      if (!user) {
        throw new NotFound("User not found!");
      }

      const { password, ...otherProps } = user;

      return otherProps;
    } catch (e) {
      console.error(e);
      throw new ServerError();
    }
  }
}
