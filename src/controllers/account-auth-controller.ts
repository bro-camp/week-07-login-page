import type { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import IUser from '#types/user-type';
import { addUser, getUser, checkUser } from '#lib/db/user';
import { viewsDirPath } from '#global/paths';

export const rootGet: RequestHandler = (_req, res) => {
  res.redirect('/home');
};

export const loginSignupGet: RequestHandler = (_req, res) => {
  res.render(`${viewsDirPath}/pages/login-signup`);
};

export const loginGet: RequestHandler = (_req, res) => {
  res.render(`${viewsDirPath}/pages/login`);
};

export const loginPost: RequestHandler = async (req, res) => {
  const info: {
    username: string;
    password: string;
  } = {
    username: req.body?.username,
    password: req.body?.password,
  };

  getUser(info.username).then((user: IUser | null) => {
    if (!user) {
      const errorMessage = 'Incorrect username';
      res.render(`${viewsDirPath}/pages/login.handlebars`, {
        errorMessage,
      });
      return;
    }

    bcrypt.compare(info.password, user.password).then((isMatch) => {
      if (!isMatch) {
        const errorMessage = 'Incorrect password';
        res.render(`${viewsDirPath}/pages/login.handlebars`, {
          errorMessage,
        });
        return;
      }

      req.session.isAuth = true;
      req.session.username = user.username;
      req.session.displayName = user.displayName;
      req.session.email = user.email;
      res.redirect('/home');
    });
  });
};

export const signupGet: RequestHandler = (_req, res) => {
  res.render(`${viewsDirPath}/pages/signup`);
};

export const signupPost: RequestHandler = async (req, res) => {
  const info = {
    username: req.body?.username,
    displayName: req.body?.displayName,
    email: req.body?.email,
    password: req.body?.password,
  };

  checkUser(info.username, (hasUser) => {
    if (hasUser) {
      const errorMessage = `User with username '${info.username}' already exists`;
      res.render(`${viewsDirPath}/pages/signup`, { errorMessage });
      return;
    }

    addUser(info)
      .then(() => res.render(`${viewsDirPath}/pages/signup-success`))
      .catch((errorMessage) => res.render(`${viewsDirPath}/pages/signup`, {
        errorMessage,
      }));
  });
};

export const userPost: RequestHandler = signupPost;

export const userGet: RequestHandler = (req, res) => {
  getUser(req.params.username).then((user: IUser | null) => {
    if (!user) {
      res.status(200).send('ERROR: No such user exists');
      return;
    }

    res
      .status(200)
      .send(
        `Username: ${user.username}<br>Display name: ${user.displayName}<br>Email: ${user.email}`,
      );
  });
};

export const checkUserGet: RequestHandler = (req, res) => {
  checkUser(req.params.username, (hasUser) => {
    if (!hasUser) {
      res
        .status(200)
        .send(`User with username '${req.params.username}' does not exist`);
      return;
    }
    res.status(200).send(`User with username '${req.params.username}' exists`);
  });
};
