import express from 'express';
import bodyParser from "body-parser";

/** порт приложения */
const port = 3000;

const app = express();


app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
