import connectMongoDBSession from 'connect-mongodb-session';
import session from 'express-session';
import { dbUrl } from '#global/values';

const MongoDBSession = connectMongoDBSession(session);

export const sessionStore = new MongoDBSession({
  uri: dbUrl,
  collection: 'sessions',
});
