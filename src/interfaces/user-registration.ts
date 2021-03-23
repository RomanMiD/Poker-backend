import { UserBase } from './user-base.interface';

export interface UserRegistration extends UserBase {
  password: string;
}
