import {Request, Response} from 'express';
import {UserUtilities} from '../utilities/user.utilities';
import {UserModel} from '../models/user.model';
import {RequestHandler} from 'express-serve-static-core';

export const accessMiddleware = async (req: Request, res: Response, next: () => void) => {
  //Есть ли заголовок авторизации
  if (req.headers.authorization) {
    // разделяем заголовок авторизации на две части
    const splittedAuthHeader = req.headers.authorization.split('Bearer ');
    //Если есть Bearer в начале, то будет 2 части
    if (splittedAuthHeader.length == 2) {
      // вторая часть- токен
      const jwtToken = splittedAuthHeader[1];
      // декодируем токен
      const decodedJwt = UserUtilities.decodeJwt(jwtToken);
      // если декодировался- значение не null
      if (decodedJwt) {
        // берем из token data email пользователя
        const {email} = (decodedJwt as any).data;
        // ищем пользователя по email в базе
        const userDocument = await UserModel.findOne({email});
        // если пользователь есть, то он есть(отвечаем чем-то как-то)
        if (userDocument) {
          // res.send({email: userDocument.email});
          res.locals.user = userDocument;
          next();
          return;
        }
      }
    }
  }
  res.status(403).send({data: null, error: 'invalid token'})
}