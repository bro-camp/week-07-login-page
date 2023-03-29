import express from 'express';
import { engine } from 'express-handlebars';
import createError from 'http-errors';
// import path from 'path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import session from 'express-session';
// import pino from 'pino';

import { Server as HttpServer } from 'http';
import { Server as HttpsServer } from 'https';
import nocache from 'nocache';
import { viewsDirPath, publicDirPath } from '#global/paths';
import indexRouter from '#routers/index-router';
import accountRouter from '#routers/account-router';
import accountAuthRouter from '#routers/account-auth-router';
import accountLogoutRouter from '#routers/account-logout-router';
import accountIsAuthorizedRouter from '#routers/account-is-authorized';
import homeRouter from '#routers/home-router';
import { dbUrl } from '#global/values';
import { sessionStore } from '#global/session-store';
import { checkAuth, goHomeIfAuth } from '#lib/auth/auth';

export const app = express();

const main = () => {
  app.engine(
    'handlebars',
    engine({
      defaultLayout: `${viewsDirPath}/layouts/main`,
    }),
  );
  app.set('view engine', 'handlebars');
  app.set('views', viewsDirPath);
  app.set('etag', false);

  app.use(nocache());
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(
    session({
      secret: 'Key that will sign cookie',
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
    }),
  );

  app.use('/public', express.static(publicDirPath));
  app.use('/', indexRouter);
  app.use('/home', checkAuth, homeRouter);
  app.use('/account', accountRouter);
  app.use('/account/auth', goHomeIfAuth, accountAuthRouter);
  app.use('/account/logout', checkAuth, accountLogoutRouter);
  app.use('/account/is-authorized', accountIsAuthorizedRouter);

  // catch 404 and forward to error handler
  app.use((_req, _res, next) => {
    next(createError(404));
  });
};

export const configureMongoose = (
  server: HttpServer | HttpsServer,
): mongoose.Connection => {
  console.log('MONGOOSE: Connecting...');
  mongoose
    .connect(dbUrl)
    .then(() => {
      main();
      console.log('MONGOOSE: Connected');
    })
    .catch((err) => console.log(`MONGOOSE: ${err}`));

  mongoose.connection
    .on('connected', () => {
      console.log('MONGOOSE: Default connection is open to', dbUrl);
    })
    .on('disconnected', () => {
      console.log('MONGOOSE: Default connection is disconnected');
    })
    .on('error', (err) => {
      console.log(
        `MONGOOSE: Default connection has occured an error:\nError: ${err}`,
      );
    })
    .on('close', () => {
      console.log('MONGOOSE: Connection closed.');
      console.log('EXPRESS: Closing HTTP server.');
      server.close((serverErr) => {
        console.log('EXPRESS: HTTP server closed.');
        if (serverErr) console.log(`\nSERVER ERROR: ${serverErr}`);
        process.exit(serverErr ? 1 : 0);
      });
    });

  return mongoose.connection;
};
// main();

// error handler
// app.use((err: Errback, req: Request, res: Response, _next: NextFunction) => {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// app.use((_req, res) => {
//   res.status(404).send('404 ERROR');
// });
