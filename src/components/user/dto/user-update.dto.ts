import { User } from './user.dto';

export type UpdateUser =
    | Partial<User> & Pick<User, Exclude<keyof User, 'password'>>;
