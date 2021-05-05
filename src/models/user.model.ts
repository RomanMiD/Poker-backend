import { Document, model, Schema } from 'mongoose';
import { UserBase, UserRegistration } from 'poker-common';

export interface UserDocument extends Document, Omit<UserRegistration, "_id"> {
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

UserSchema.methods.base = function (): UserBase {
  return {email: this.email, name: this.name, _id: this._id}
}

export const UserModel = model<UserDocument>('User', UserSchema);
