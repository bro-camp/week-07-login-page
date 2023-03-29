export enum GetUserErrorEnum {
  EmptyUsername,
  NoUser,
}

export interface IGetUserError {
  type: GetUserErrorEnum;
  message: string;
}
