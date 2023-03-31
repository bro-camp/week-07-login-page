import bcrypt from 'bcrypt';
import User from '#models/user-model';
import IUser from '#types/user-type';

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

    if (username.length < 2) {
      reject('Username needs to be at least 2 characters long');
      return;
    }

    if (username.length > 50) {
      reject('Username cannot be longer than 50 characters');
      return;
    }

    if (!/^([A-Za-z0-9]|_|-)([A-Za-z0-9]|_|-)*$/.test(username)) {
      reject('Username is not in valid format');
      return;
    }

    if (password === undefined) {
      reject('Password is not given');
      return;
    }

    if (password.length < 12) {
      reject('Password needs to be at least 12 characters long');
      return;
    }

    if (password.length > 200) {
      reject('Password cannot be longer than 200 characters');
      return;
    }

    if (displayName === undefined) {
      reject('Display name is not given');
      return;
    }

    if (displayName.length < 2) {
      reject('Display name needs to be at least 2 characters long');
      return;
    }

    if (displayName.length > 50) {
      reject('Display name cannot be longer than 50 characters');
      return;
    }

    if (!/^[A-Za-z](\x20?[A-Za-z])*$/.test(displayName)) {
      reject('Display name is not in valid format');
      return;
    }

    if (email === undefined) {
      reject('Email is not given');
      return;
    }

    if (email.length < 2) {
      reject('Email needs to be at least 2 characters long');
      return;
    }

    if (email.length > 100) {
      reject('Email cannot be longer than 100 characters');
      return;
    }

    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      reject('Email is not in valid format');
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
