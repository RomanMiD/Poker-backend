import { Router } from 'express';
import { Validator } from 'express-json-validator-middleware';
import { newGameBodySchema } from './json-schemas/game/create.schema';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { GameController } from '../../controllers/api/game.controller';
import { fullGameParamsSchema } from './json-schemas/game/full.schema';

export const gameApiRoute = Router();

const validate = new Validator({allErrors: true}).validate;
gameApiRoute.post('/create', validate({body: newGameBodySchema}), authMiddleware, GameController.create);

gameApiRoute.get('/full/:id', validate({params: fullGameParamsSchema}), authMiddleware, GameController.full);

