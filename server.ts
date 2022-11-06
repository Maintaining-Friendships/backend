import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import routes from './src/routes/index'


dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Maintaining Friendships API');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server!!!! is running at https://localhost:${port}`);
});

app.use(express.json())
app.use('/api', routes)