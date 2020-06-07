import { observable, reaction, computed } from 'mobx';
// store
import { Auth } from './auth';

export interface IStore {
  auth: Auth;
}

class Store {
  @observable private _store: IStore = {
    auth: new Auth()
  };

  constructor() {
    reaction(
      () => Object.keys(this._store).filter(d => d !== undefined),
      store => console.log(store)
    )
  }

  @computed
  get auth(): Auth {
    return this._store.auth
  }
}

export const store = new Store();