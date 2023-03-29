import bcrypt from 'bcrypt';
import User from '#models/user-model';
import IUser from '#types/user-type';
// import { IGetUserError, GetUserErrorEnum } from '#types/lib/db/user';

export const addUser = (info: IUser) => {
  return new Promise<void>((resolve, reject) => {
    const username = info?.username;
    const displayName = info?.displayName;
    const email = info?.email;
    const password = info?.password;

    if (username === undefined) {
      reject('Username is not given');
      return;
    }

    if (password === undefined) {
      reject('Password is not given');
      return;
    }

    if (!displayName === undefined) {
      reject('Display name is not given');
      return;
    }

    if (!email === undefined) {
      reject('Email is not given');
      return;
    }

    const SALT_ROUNDS = 12;

    bcrypt.hash(password, SALT_ROUNDS).then((hashedPassword) => {
      const newUser = new User({
        username,
        displayName,
        email,
        password: hashedPassword,
      });
      newUser
        .save()
        .then(() => resolve())
        .catch((err) => reject(`${err}`));
    });
  });
};

export const getUser = (username: string) => {
  return new Promise<IUser | null>((resolve, _reject) => {
    if (username.length === 0) {
      resolve(null);
      return;
    }

    User.findOne({ username }).then((userObj) => {
      if (userObj === null) {
        resolve(null);
        return;
      }

      const user: IUser = {
        username: userObj?.username,
        displayName: userObj?.displayName,
        email: userObj?.email,
        password: userObj?.password,
      };

      resolve(user);
    });
  });
};

export const checkUser = (
  username: string,
  callback: (hasUser: boolean) => void,
) => {
  if (username.length === 0) {
    callback(false);
    return;
  }

  User.findOne({ username }).then((userObj) => {
    if (userObj === null) {
      callback(false);
      return;
    }

    callback(true);
  });
};
