import { setupAndStartMongoWithApp } from '#root/app';
import { dbUrl, PORT } from '#global/values';

setupAndStartMongoWithApp(dbUrl, PORT);

export {};
