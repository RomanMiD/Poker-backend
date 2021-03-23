import { Router } from 'express';
import { Validator } from 'express-json-validator-middleware';
import { registrationBodySchema } from './json-schemas/user/registration.schema';
import { UserRegistration } from '../../interfaces/user-registration';
import { UsersController } from '../../controllers/api/users.controller';

export const userApiRoute = Router();

const validate = new Validator({allErrors: true}).validate;



userApiRoute.post('/registration', validate({body: registrationBodySchema}), (req, res) => {
  const registrationData: UserRegistration = req.body;
  UsersController.registration(registrationData).then((result) => {

    res.send({data: result});
  }).catch((err) => {
    res.status(400).send(err);
  });

});


