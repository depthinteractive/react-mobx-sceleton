import React, { Component } from 'react';
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { MobXProviderContext } from 'mobx-react';
import _ from 'lodash';
// core
import { IResponse, IError, IResponseError } from './Response';
// components
import Error from '../components/blocks/error';

export interface IWithErrorHandler { errors: IResponseError[] | null; }

const withErrorHandler = (WrappedComponent: any, Axios: AxiosInstance) => {
  interface IProps {}
  interface IState extends IWithErrorHandler {
    hideError: boolean;
  }
  
  let reqInterceptor: number;
  let resInterceptor: number;
  const WithErrorHandlerContext = React.createContext<IWithErrorHandler | undefined>( undefined );

  type Props = IProps;
  
  return class extends Component<Props, IState> {
    static contextType = MobXProviderContext;

    constructor(props: Props) {
      super(props);
      this.state = { errors: null, hideError: true }
      this.interceptors();
    }

    async interceptors(): Promise<void> {
      reqInterceptor = Axios.interceptors.request.use(
        async (req: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
          if(this.context.store.auth.token){
            req.headers = {...req.headers, Authorization: 'Bearer ' + this.context.store.auth.token}
          }
          return req;
        });
      resInterceptor = Axios.interceptors.response.use(
        async (res: AxiosResponse<IResponse<any>>): Promise<AxiosResponse<IResponse<any>>> => res,
        async (err: IError<IResponseError>): Promise<never> => {
          let errors: IResponseError[] = [];
          if(err.response.data.errors === undefined){
            errors.push(err.response.data);
          }else if(err.response.data.errors instanceof Array){
            errors = [...err.response.data.errors];
          }

          _.map(errors, (err: IResponseError): void => {
            if(err.code === 422) this.context.store.auth.logout();
          });

          console.log(this.context.store.auth)

          this.setState({ errors, hideError: false });
          return Promise.reject(err);
        });
    };

    componentWillUnmount(): void {
      Axios.interceptors.request.eject(reqInterceptor);
      Axios.interceptors.response.eject(resInterceptor);
    }

    onHideError(): void {
      this.setState({ hideError: !this.state.hideError });
    }

    render() {
      const context: IWithErrorHandler = { ...this.state };
      return (
        <>
          {this.state.errors && !this.state.hideError ? <Error errors={this.state.errors} hideError={this.onHideError} /> : null}
          <WithErrorHandlerContext.Provider value={ context }>
            <WrappedComponent { ...this.props } />
          </WithErrorHandlerContext.Provider>
        </>
      );
    }
  }
}
export default withErrorHandler;
