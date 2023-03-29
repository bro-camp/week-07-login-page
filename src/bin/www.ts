import { app, configureMongoose } from '#root/app';

const PORT = 8080;
const server = app.listen(PORT, () => console.log(`APP: It's alive on http://localhost:${PORT}`));

const mongooseConnection = configureMongoose(server);

const cleanup = (signal: string) => {
  console.log('\n\n');
  console.log(`${signal} signal received.`);
  console.log('MONGOOSE: Closing connection.');
  mongooseConnection.close();
};

process.on('SIGINT', () => cleanup('SIGINT'));
process.on('SIGTERM', () => cleanup('SIGTERM'));

export {};
