import { server } from './server';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT ?? (8080 as const);

server.listen(port, () => {
  console.log('listening...');
});
