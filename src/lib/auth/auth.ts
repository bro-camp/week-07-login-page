import { RequestHandler } from 'express';

export const checkAuth: RequestHandler = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    res.redirect('/account/auth/login-signup');
  }
};

export const goHomeIfAuth: RequestHandler = (req, res, next) => {
  if (req.session.isAuth) {
    res.redirect('/home');
  } else {
    next();
  }
};
