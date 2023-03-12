import { server } from './server';
import { Metric } from '@nickgdev/porygon-metlib/lib/node-exports';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT ?? (8080 as const);

server.listen(port, () => {
  console.log('listening...');
});
