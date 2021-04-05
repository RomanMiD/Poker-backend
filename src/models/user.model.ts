import { Document, model, Schema } from 'mongoose';
import {
  UserBase,
  UserRegistration
} from "poker-common";

export interface UserDocument extends Document, UserRegistration {
  base(): UserBase;
}

const UserSchema = new Schema<UserDocument>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }

});

export const UserModel = model<UserDocument>('User', UserSchema);

UserModel.prototype.base = function (): UserBase {
  return {email: this.email, name: this.name}
}
