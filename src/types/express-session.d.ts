declare module 'express-session' {
  interface SessionData {
    isAuth: boolean;
    username: string;
    displayName: string;
    email: string;
  }
}

export {};
