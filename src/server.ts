import dotenv from 'dotenv';

dotenv.config();

import { createServer, Server } from 'http';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { MetricSync } from '@nickgdev/porygon-metlib/lib/node-exports';

const app = express();

app.use(cors());
app.use(express.json());

function healthCheckHandler(_req: Request, res: Response) {
  res.json({ health: '240HP' });
};

const healthCheckHandlerWithMetrics = new MetricSync<void>({
  endpoint: 'http://localhost:7100',
  functionName: 'health_check_handler',
  serviceName: 'cyndaquil-users',
  axiosOverrides: {
    headers: {
      "X-API-KEY": "cyndaquil"
    }
  }
})

app.get(
  '/', 
  (req, res) => {
    healthCheckHandlerWithMetrics.monitor(
      () => healthCheckHandler(req, res)
    )
  }
);

const server: Server = createServer(app);

export { server };
