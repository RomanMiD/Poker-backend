import { Document, model, Schema } from 'mongoose';
import { UserRegistration } from '../interfaces/user-registration';

interface UserDocument extends Document, UserRegistration{
}
const UserSchema = new Schema<UserDocument>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name:{
    type: String,
    required: true,
  },
  password:{
    type: String,
    required: true,
  }

});

export const UserModel = model<UserDocument>('User', UserSchema);

