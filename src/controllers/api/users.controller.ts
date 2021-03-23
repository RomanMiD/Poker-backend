import { UserRegistration } from '../../interfaces/user-registration';
import { UserModel } from '../../models/user.model';
import md5 from 'md5';
import { userConfig } from '../../configs/users.config';

export class UsersController {

  static async registration(registrationData: UserRegistration) {
    console.log(registrationData);
    registrationData = {...registrationData,
      password: md5(`${registrationData.password}${userConfig.salt}`)}

    const user = new UserModel(registrationData);
    return await user.save().catch((err) => {
      console.log(err)
      if (err.code === 11000) {
        throw {error: 'email already use'};
      }
      throw err;
    })

  }
}
