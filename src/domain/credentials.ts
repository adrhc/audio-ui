import { Buffer } from 'buffer';
import _ from 'lodash';

export let AUTHORIZATION: string | null | undefined = undefined;
export function setGlobalAuthorization(token?: string | null) {
  AUTHORIZATION = token;
}

export class Credentials {
  constructor(
    public user?: string | null,
    public password?: string | null
  ) {}

  token() {
    if (this.isValid()) {
      return `Basic ${Buffer.from(`${this.user}:${this.password}`).toString('base64')}`;
    }
  }

  encodedPassword() {
    if (this.password) {
      // return encodeURIComponent(this.password);
      return btoa(this.password);
    }
  }

  isIncomplete() {
    return _.isEmpty(this.user) || _.isEmpty(this.password);
  }

  isValid() {
    return !_.isEmpty(this.user) && !_.isEmpty(this.password);
  }

  eq(other?: Credentials | null) {
    return !other || other.user != this.user || other.password != this.password;
  }
}

export function credentialsOf(record: Record<string, string | null>) {
  return new Credentials(record.user, record.password);
}

/* export function isEmpty(credentials: Credentials) {
  return credentials == null || nvl(credentials.user, credentials.password) == null;
}*/

/* export function isIncomplete(credentials: Credentials) {
  return credentials == null || _.isEmpty(credentials.user) || _.isEmpty(credentials.password);
}

export function isValid(credentials: Credentials) {
  return credentials != null && !_.isEmpty(credentials.user) && !_.isEmpty(credentials.password);
} */
