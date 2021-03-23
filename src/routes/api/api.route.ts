import { Router } from 'express';
import { userApiRoute } from './users.route';
import { gameApiRoute } from './game.route';

export const apiRoute = Router();

apiRoute.use('/users', userApiRoute);
apiRoute.use('/game', gameApiRoute)

