import dotenv from 'dotenv';

dotenv.config();

import { createServer, Server } from 'http';
import express from 'express';
import cors from 'cors';
import { add } from '@nickgdev/porygon-metlib/lib/node';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  const { query } = req;
  const number = parseInt(query.number as string);
  res.json({ numberPlusOne: add(number) });
});

const server: Server = createServer(app);

export { server };
