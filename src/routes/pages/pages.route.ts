import {Router} from 'express';
import { errorRoute } from './errors.route';
import path from 'path';

export const pagesRoute = Router();

pagesRoute.use('/error', errorRoute);

pagesRoute.get('/', (req, res) => {
  res.sendFile(path.resolve('./src/views/index.html'))
})
