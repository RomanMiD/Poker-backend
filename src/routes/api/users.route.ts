import { Router } from 'express';
import { Validator } from 'express-json-validator-middleware';
import { registrationBodySchema } from './json-schemas/user/registration.schema';
import { UsersController } from '../../controllers/api/users.controller';
import { loginBodySchema } from './json-schemas/user/login.schema';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { whoAmIBodySchema } from './json-schemas/user/who-am-i.schema';
import { findQuerySchema } from './json-schemas/user/find.schema';
import { strictBlackSchema } from './json-schemas/common.schema';


export const userApiRoute = Router();
const validate = new Validator({allErrors: true}).validate;

userApiRoute.post('/registration', validate({
  body: registrationBodySchema,
  params: strictBlackSchema,
  query: strictBlackSchema
}), UsersController.registration)

userApiRoute.post('/login', validate({
  body: loginBodySchema,
  params: strictBlackSchema,
  query: strictBlackSchema
}), UsersController.login);

userApiRoute.get('/whoAmI', validate({
  body: whoAmIBodySchema,
  params: strictBlackSchema,
  query: strictBlackSchema
}), authMiddleware, UsersController.whoAmI);

userApiRoute.get('/find', validate({
  query: findQuerySchema,
  params: strictBlackSchema,
  body: strictBlackSchema
}), authMiddleware, UsersController.find);

