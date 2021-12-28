import { Attributes } from './Attributes';
import { Collection } from './Collection';
import { Eventing } from './Eventing';
import { Model } from './Model';
import { SyncAPI } from './SyncAPI';

export interface UserProps {
  id?: number;
  name?: string;
  age?: number;
}

const rootURL: string = 'http://localhost:3000/users';

export class User extends Model<UserProps> {
  static create(attrs: UserProps): User {
    return new User(
      new Attributes<UserProps>(attrs),
      new Eventing(),
      new SyncAPI<UserProps>(rootURL)
    );
  }

  static createCollection() {
    const userCollection = new Collection<User, UserProps>(rootURL, (json) =>
      User.create(json)
    );
    return userCollection;
  }
}
