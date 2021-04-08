import { UserDocument, UserModel } from '../../models/user.model';
import { UserUtilities } from '../../utilities/user.utilities';
import { Request, Response } from 'express';
import { LoginRequest, RegistrationRequest } from "poker-common";
import { MiddlewareError } from "../../classes/middleware-error";
import { MiddlewareUtilities } from "../../utilities/middleware.utilities";
import { LoginResponseData } from "poker-common";


export class UsersController {

  static async login(req: Request, res: Response, next: (err: MiddlewareError) => void) {
    const requestData: LoginRequest = req.body;
    const userDocument = await UserModel.findOne({
      email: requestData.email,
      password: UserUtilities.encodeDBPassword(requestData.password),
    });
    if (userDocument) {
      const responseData: LoginResponseData = {
        token: UserUtilities.generateJwt(userDocument),
        user: userDocument.base
      }
      return res.send(MiddlewareUtilities.responseData(res, responseData));
    } else {
      next(new MiddlewareError('Incorrect email or password', 401));
    }
  }

  static whoAmI(req: Request, res: Response) {
    const userDocument: UserDocument = res.locals.user;

    // throw new MiddlewareError('user or password not found', 401, 11111)
    res.send(userDocument.base());
  }

  static async registration(req: Request, res: Response, next: (err: MiddlewareError) => void) {

    const registrationData: RegistrationRequest = {
      ...req.body,
      password: UserUtilities.encodeDBPassword(req.body.password)
    };
    const user = new UserModel(registrationData);
    const userDocument: UserDocument | void = await user.save().catch((err) => {
      if (err.code === 11000) {
        next(new MiddlewareError('email already use', 409));
      }
    });
    if (userDocument) {
      return res.send(MiddlewareUtilities.responseData(res, userDocument.base()));
    }


  }
}

