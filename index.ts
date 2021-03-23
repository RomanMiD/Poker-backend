import express from 'express';
import cors from 'cors'
import bodyParser from 'body-parser';
import { apiRoute } from './src/routes/api/api.route';
import { pagesRoute } from './src/routes/pages/pages.route';
import { ValidationError } from 'express-json-validator-middleware';
import mongoose from 'mongoose';

/** порт приложения */
const PORT = 3000;
const app = express();

app.use(cors())
app.use(bodyParser.json());
app.use('/api', apiRoute);
app.use('/', pagesRoute);

app.use((err: any, req: any, res: any, next: any) => {
  if (err instanceof ValidationError) {
    // At this point you can execute your error handling code
    res.status(400).send({
      statusText: 'Bad Request',
      validations: err.validationErrors,

    });
    next();
  } else next(err); // pass error on if not a validation error
});
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://127.0.0.1:27017/pokher', {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Example app listening at http://localhost:${PORT}`);
    });
  });

