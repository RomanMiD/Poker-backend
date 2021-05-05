import { Router } from 'express';
import { Validator } from 'express-json-validator-middleware';
import { registrationBodySchema } from './json-schemas/user/registration.schema';
import { UsersController } from '../../controllers/api/users.controller';
import { loginBodySchema } from './json-schemas/user/login.schema';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { whoAmIBodySchema } from './json-schemas/user/who-am-i.schema';
import { findQuerySchema } from './json-schemas/user/find.schema';


export const userApiRoute = Router();
const validate = new Validator({allErrors: true}).validate;

userApiRoute.post('/registration', validate({body: registrationBodySchema}), UsersController.registration)

userApiRoute.post('/login', validate({body: loginBodySchema}), UsersController.login);

userApiRoute.post('/whoAmI', validate({body: whoAmIBodySchema}), authMiddleware, UsersController.whoAmI);

userApiRoute.get('/find', validate({query: findQuerySchema}), authMiddleware, UsersController.find);

