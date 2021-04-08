import md5 from 'md5';
import { userConfig } from '../configs/users.config';

import * as jwt from 'jsonwebtoken';

import { UserDocument } from '../models/user.model';

export namespace UserUtilities {
  export const encodeDBPassword = (userPassword: string): string => {
    return md5(`${userPassword}${userConfig.salt}`)
  };

  export const generateJwt = (userData: UserDocument): any => {
    const data = {
      _id: userData._id,
      email: userData.email,
    }
      return jwt.sign({data}, userConfig.secretJwt, {expiresIn: userConfig.sessionExpires});

  }
  export const decodeJwt=(token:string)=>{
    try{
      return jwt.verify(token, userConfig.secretJwt);
    } catch (e){
      return null;
    }
  };
}
