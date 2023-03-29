import { Schema, model } from 'mongoose';
import type IUser from '#types/user-type';

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

const User = model<IUser>('User', userSchema);

export default User;
