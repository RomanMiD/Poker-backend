import { Router } from "express";
import path from 'path';

export const errorRoute = Router();

errorRoute.get('/404', (req, res) => {
  res.sendFile(path.resolve('./src/views/404Error.html'));
});
