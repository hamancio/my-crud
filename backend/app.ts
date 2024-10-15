import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import itemRoutes from './src/routes/itemRoutes';

export const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/items', itemRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Servidor funcionando');
});