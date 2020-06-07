import { observable, action, computed } from 'mobx';
import { AxiosResponse } from 'axios';
// core
import Axios from '../core/axios';
import { IGraphql, IResponse } from '../core/Response';

export interface IAuth {
  email: string | null;
  token: string | null;
  userId: string | null;
  tokenExpiration: number | null;
}
export class Auth implements IAuth {
  protected static timeout: NodeJS.Timeout;
  
  @observable private _email!: string | null;
  @observable private _token!: string | null;
  @observable private _userId!: string | null;
  @observable private _tokenExpiration!: number | null;

  @computed
  get email(): string | null {
    return this._email;
  }
  set email(value: string | null){
    this._email = value;
  }

  @computed
  get token(): string | null {
    return this._token!;
  }
  set token(value: string | null){
    this._token = value;
  }

  @computed
  get userId(): string | null {
    return this._userId!;
  }
  set userId(value: string | null){
    this._userId = value;
  }

  @computed
  get tokenExpiration(): number | null {
    return this._tokenExpiration!;
  }
  set tokenExpiration(value: number | null){
    this._tokenExpiration = value;
  }

  @action
  async logout(): Promise<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('expiryDate');
    localStorage.removeItem('userId');
    this.email = null;
    this.token = null;
    this.userId = null;
    this.tokenExpiration = null;
  };

  @action
  async isLogged(): Promise<void> {
    const token: string | null = localStorage.getItem('token');
    const expiryDate: string | null = localStorage.getItem('expiryDate');
    
    if(token && expiryDate && (new Date(expiryDate) <= new Date())){
      const userId: string = localStorage.getItem('userId') as string; //'5dfb64b703cab32a0424d55d'
      const requestBody = {
        query: `
          query ReadUser($id: ID!){
            readUser(input: {_id: $id}){
              email
            }
          }
        `,
        variables: { id: userId }
      };
        
      try{
        const res: AxiosResponse<IResponse<IGraphql<IAuth>>> = await Axios({ data: requestBody });
        const user: IAuth = res.data.data.readUser;
        await this.login({...user, token, userId, tokenExpiration: 1 });
      }catch(err){
        throw err;
      }
    }
  }

  @action
  async login(auth: IAuth): Promise<void> {
    if(Auth.timeout) 
      clearTimeout(Auth.timeout); 
    const remainingMilliseconds: number = 60 * 60 * 1000;
    const expiryDate: Date = new Date(new Date().getTime() + remainingMilliseconds);
  
    localStorage.setItem('token', auth.token as string);
    localStorage.setItem('userId', auth.userId as string);
    localStorage.setItem('expiryDate', expiryDate.toISOString());
    this.email = auth.email;
    this.token = auth.token;
    this.userId = auth.userId;
    this.tokenExpiration = auth.tokenExpiration;
    Auth.timeout = setTimeout(() => { this.logout() }, remainingMilliseconds);
  }

  @action
  async onLogin(values: any): Promise<void> {
    const requestBody = {
      query: `
        query Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            email
            userId
            token
            tokenExpiration
          }
        }
      `,
      variables: { email: values.email, password: values.password }
    };

    try{
      const res: AxiosResponse<IResponse<IGraphql<IAuth>>> = await Axios({ data: requestBody });
      await this.login(res.data.data.login);
    }catch(err){
      throw err;
    }
  }

  @action
  async onSignup(values: any): Promise<void> {
    const requestBody = {
      query: `
        query Signup($email: String!, $password: String!) {
          signup(email: $email, password: $password) {
            email
            userId
            token
            tokenExpiration
          }
        }
      `,
      variables: { email: values.email, password: values.password }
    };

    try{
      const res: AxiosResponse<IResponse<IGraphql<IAuth>>> = await Axios({ data: requestBody });
      await this.login(res.data.data.signup);
    }catch(err){
      throw err;
    }
  }

}