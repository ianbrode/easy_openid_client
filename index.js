import uuid     from 'uuid/v4';
import qs       from 'qs';
import Storage  from './storage';

const location = window.location;

export default class Auth {
  constructor(namespace, config) {
    this.storage = new Storage(namespace);
    this.config = config;
  }

  login(boot) {
    return new Promise((resolve, reject) =>
        this.storage.getSS('token')
          ? resolve()
          : reject(this.storage.getLS('state'))
      )
      .then(boot)
      .catch(state => 
        state
          ? this.processState(state)
          : this.goToAuth()
      );
  }

  processState(state) {
    this.checkOrigin(state) ? this.goToPage() : this.goToAuth();
  }

  checkOrigin(original_state) {
    const { state } = qs.parse(location.hash.replace('#', ''));
    return original_state === state;
  }

  goToPage() {
    const url = this.storage.getLS('url');
    this.storage.setSS('token', location.hash.replace('#', ''));
    this.storage.removeLS('url', 'state')
    location.replace(url)
  }

  goToAuth() {
    const state = uuid();
    const nonce = uuid();
    const { AUTH_CLIENT_ID, AUTH_REDIRECT_URI, AUTH_URL, AUTH_SCOPE } = this.config;
    const query = {
      'client_id'    : AUTH_CLIENT_ID,
      'redirect_uri' : AUTH_REDIRECT_URI,
      'response_type': 'id_token token',
      'scope'        : AUTH_SCOPE,
      'state'        : state,
      'nonce'        : nonce
    };
    const authUrl = ${AUTH_URL}/authorize?${qs.stringify(query)};
    this.storage.setLS('state', state);
    this.storage.setLS('url', location.pathname);
    location.replace(authUrl);
  }

  logout() {
    this.storage.removeSS('token');
    this.goToAuth();
  }
}