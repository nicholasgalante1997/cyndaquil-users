import { server } from './server';

const port = process.env.HOSTNAME ?? (8080 as const);

server.listen(port, () => {
  console.log('listening...');
});
