import dotenv from 'dotenv';

dotenv.config();

import { createServer, Server } from 'http';
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ health: '240HP' });
});

const server: Server = createServer(app);

export { server };
