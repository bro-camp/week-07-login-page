import express, { Express } from 'express';
import { engine } from 'express-handlebars';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import session from 'express-session';

import nocache from 'nocache';
import { viewsDirPath, publicDirPath } from '#global/paths';
import indexRouter from '#routers/index-router';
import accountRouter from '#routers/account-router';
import accountAuthRouter from '#routers/account-auth-router';
import accountLogoutRouter from '#routers/account-logout-router';
import accountIsAuthorizedRouter from '#routers/account-is-authorized';
import homeRouter from '#routers/home-router';
import { sessionStore } from '#global/session-store';
import { checkAuth, goHomeIfAuth } from '#lib/auth/auth';

// export const app = express();

const setupApp = (app: Express) => {
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
  app.use((req, _res, next) => {
    if (req.app.get('env') === 'development') next(createError(404));
    else next();
  });

  app.use((_req, res) => {
    res.status(404);
    res.render(`${viewsDirPath}/pages/error`, {
      errorType: '404',
      errorMessage: 'Not Found',
    });
  });
};

const startApp = (app: Express, PORT: string | number) => {
  const server = app.listen(PORT, () => {
    console.log(
      `\n\n* EXPRESS : Server started on http://localhost:${PORT}\n\n`,
    );
  });

  return server;
};

const onMongooseConnected = (dbUrl: string, PORT: string | number) => {
  console.log('* MONGOOSE: Default connection is open at', dbUrl);
  const app = express();
  setupApp(app);
  const server = startApp(app, PORT);

  const cleanup = (signal: string) => {
    console.log('\n\n');
    console.log(`* ${signal} signal received.`);

    console.log('* EXPRESS: Closing HTTP server.');
    server.close((serverErr) => {
      if (serverErr) {
        console.log(`\n\nSERVER ERROR: ${serverErr}`);
        process.exit(serverErr ? 1 : 0);
      }
      console.log('* EXPRESS: HTTP server closed.');
    });

    console.log('* MONGOOSE: Closing connection.');
    mongoose.connection.close();
  };

  process.on('SIGINT', () => cleanup('SIGINT'));
  process.on('SIGTERM', () => cleanup('SIGTERM'));
};

export const setupAndStartMongoWithApp = (
  dbUrl: string,
  PORT: string | number,
) => {
  console.log('\n\n* MONGOOSE: Connecting...');

  mongoose
    .connect(dbUrl)
    .then(() => {
      console.log('* MONGOOSE: Connected');
    })
    .catch((err) => console.log(`\n\n* MONGOOSE: ${err}`));

  mongoose.connection
    .on('connected', () => onMongooseConnected(dbUrl, PORT))
    .on('disconnected', () => {
      console.log('* MONGOOSE: Default connection is disconnected');
    })
    .on('error', (err) => {
      console.log(
        `\n\n* MONGOOSE: Default connection has occured an error:\nError: ${err}`,
      );
    })
    .on('close', () => {
      console.log('* MONGOOSE: Connection closed.');
    });
};
