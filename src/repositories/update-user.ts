import { db } from "../lib/prisma";

interface UpdateUserProps {
  new_first_name: string | null;
  new_last_name: string | null;
  new_email: string | null;
  new_password: string | null;
}

export class UpdateUserRepository {
  async execute(userId: string, updateUserParams: UpdateUserProps) {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) return null;

    const { new_first_name, new_last_name, new_email, new_password } =
      updateUserParams;

    const firstName = new_first_name ? new_first_name : user.first_name;
    const lastName = new_last_name ? new_last_name : user.last_name;
    const email = new_email ? new_email : user.email;
    const password = new_password ? new_password : user.password;
    
    const updatedUser = await db.user.update({
      data: {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password
      },
      where: {
        id: userId
      }
    })

    return updatedUser
  }
}
