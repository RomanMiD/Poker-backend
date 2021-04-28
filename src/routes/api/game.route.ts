import { Router } from 'express';
import { Validator } from 'express-json-validator-middleware';
import { newGameBodySchema } from './json-schemas/user/game/game.schema';
import { accessMiddleware } from '../../middlewares/access.middleware';
import { GameController } from '../../controllers/api/game.controller';

export const gameApiRoute = Router();

const validate = new Validator({allErrors: true}).validate;
gameApiRoute.post('/create',validate({body: newGameBodySchema}),  accessMiddleware, GameController.createGame);

