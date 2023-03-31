import { app, configureMongoose } from '#root/app';
import { PORT } from '#global/values';

const server = app.listen(PORT, () => console.log(`* EXPRESS : Server started on http://localhost:${PORT}`));

const mongooseConnection = configureMongoose(server);

const cleanup = (signal: string) => {
  console.log('\n\n');
  console.log(`* ${signal} signal received.`);
  console.log('* MONGOOSE: Closing connection.');
  mongooseConnection.close();
};

process.on('SIGINT', () => cleanup('SIGINT'));
process.on('SIGTERM', () => cleanup('SIGTERM'));

export {};
