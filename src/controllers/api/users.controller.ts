import { UserDocument, UserModel } from '../../models/user.model';
import { UserUtilities } from '../../utilities/user.utilities';
import { Request, Response } from 'express';
import { LoginRequest, LoginResponseData, RegistrationRequest } from 'poker-common';
import { MiddlewareError } from '../../classes/middleware-error';
import { MiddlewareUtilities } from '../../utilities/middleware.utilities';
import sanitize from 'mongo-sanitize';


export class UsersController {

  static async login(req: Request, res: Response, next: (err: MiddlewareError) => void) {
    const requestData: LoginRequest = sanitize(req.body);
    const userDocument = await UserModel.findOne({
      email: requestData.email,
      password: UserUtilities.encodeDBPassword(requestData.password),
    });
    if (userDocument) {
      const responseData: LoginResponseData = {
        token: UserUtilities.generateJwt(userDocument),
        user: userDocument.base
      }
      MiddlewareUtilities.responseData(res, responseData);
    } else {
      next(new MiddlewareError('Incorrect email or password', 403));
    }
  };

  static whoAmI(req: Request, res: Response) {
    const userDocument: UserDocument = res.locals.user;

    // throw new MiddlewareError('user or password not found', 401, 11111)
    MiddlewareUtilities.responseData(res, userDocument.base());
  }

  static async registration(req: Request, res: Response, next: (err: MiddlewareError) => void) {

    const registrationData: RegistrationRequest = {
      ...sanitize(req.body),
      password: UserUtilities.encodeDBPassword(req.body.password)
    };
    const user = new UserModel(registrationData);
    const userDocument: UserDocument | void = await user.save().catch((err) => {
      if (err.code === 11000) {
        next(new MiddlewareError('email already use', 409));
      }
    });
    if (userDocument) {
      MiddlewareUtilities.responseData(res, userDocument.base());
    }
  }

  static async find(req: Request, res: Response, next: (err: MiddlewareError) => void) {
    const findData = {
      $or: [
        {email: {$regex: sanitize(req.query.query) as string, $options: 'i'}},
        {name: {$regex: sanitize(req.query.query) as string, $options: 'i'}}
      ]
    }
    const response = (await UserModel.find(findData)
      .limit(+(req.query?.limit || 10))
      .skip(+(req.query?.skip || 10)))
      .map((userDocument) => userDocument.base());
    MiddlewareUtilities.responseData(res, response);
  }
}


