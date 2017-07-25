export default class Storage {
  constructor(namespace) { this.namespace = namespace }
  _getItem(params, store) {
    const result = params.map((e) => store.getItem(`${e}_${this.namespace}`));
    return result.length > 1 ? result : result[0];
  }
  _removeItem(params, store) {
    params.forEach((e) => store.removeItem(`${e}_${this.namespace}`));
  }
  getSS(...params) { return this._getItem(params, sessionStorage) }
  getLS(...params) { return this._getItem(params, localStorage) }
  setSS(param, value) {
    return sessionStorage.setItem(`${param}_${this.namespace}`, value);
  }
  setLS(param, value) {
    return localStorage.setItem(`${param}_${this.namespace}`, value);
  }
  removeSS(...params) { this._removeItem(params, sessionStorage) }
  removeLS(...params) { this._removeItem(params, localStorage) }
}