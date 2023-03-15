import dotenv from 'dotenv';
import { createServer, Server } from 'http';
import express from 'express';
import cors from 'cors';
import { MetricSync } from '@nickgdev/porygon-metlib/lib/node-exports';

dotenv.config(); 

import { trace, validateAuthHeader } from './middleware';
import { createUserHandler, healthCheckHandler } from './responders';

const app = express();

app.use(cors());
app.use(express.json());
app.use(trace);

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
    healthCheckHandlerWithMetrics.time(
      () => healthCheckHandler(req, res)
    )
  }
);

const createUserHandlerWithMetrics = new MetricSync<void>({
  endpoint: 'http://localhost:7100',
  functionName: 'create_user_handler',
  serviceName: 'cyndaquil-users',
  axiosOverrides: {
    headers: {
      "X-API-KEY": "cyndaquil"
    }
  }
})

app.post(
  '/users/create',
  validateAuthHeader,
  (req, res) => {
    createUserHandlerWithMetrics.monitor( // record metrics on if the op succeeds or fails
      () => createUserHandlerWithMetrics.time( // record the duration of the op event
        () => createUserHandler(req, res) // this system of metric fn forwarding should prevent duplicate invocations of the actual target fn
      )
    )
  }
)

const server: Server = createServer(app);

export { server };
