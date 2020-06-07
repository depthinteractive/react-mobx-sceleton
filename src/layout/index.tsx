import React, { Component } from 'react';
import { StaticContext } from 'react-router';
import { BrowserRouter, Route, Switch, Redirect, RouteComponentProps } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
// layouts
import PrivateLayout from './private';
import PublicLayout from './public';
// routes
import privateRoutes, { PrivateRouteTypes } from './routes/privateRoutes';
import publicRoutes,  { PublicRouteTypes }  from './routes/publicRoutes';
import sessionRoutes from './routes/sessionRoutes';
// components
import Auth from '../components/public/pages/auth';
import NotFound from './public/NotFound';
// core
import withErrorHandler from '../core/withErrorHandler';
import Axios from '../core/axios';
import { IStore } from '../store';

@inject('store')
@observer
class Layout extends Component<Props, IState> {
  constructor(props: Props){
    super(props);
    this.props.store.auth.isLogged();
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>

          { _.map(publicRoutes, (route: PublicRouteTypes, key: string) => {
            const { component, path } = route;
            return (
              <Route
                exact
                path={ path }
                key={ key }
                render={ (route: RouteComponentProps<any, StaticContext, any>) => <PublicLayout component={ component } route={ route } auth={ this.props.store.auth }/>}
              />
            )
          }) }

          { _.map(privateRoutes, (route: PrivateRouteTypes, key: string) => {
            const { component, path } = route;
            return (
              <Route
                exact
                path={ path }
                key={ key }
                render={ (route: RouteComponentProps<any, StaticContext, any>) =>
                  this.props.store.auth.token ? (
                    <PrivateLayout component={ component } route={ route } auth={ this.props.store.auth }/>
                  ) : (
                    <PublicLayout component={ Auth } route={ route } auth={ this.props.store.auth }/>
                  )
                }
              />
            )
          }) }

          { _.map(sessionRoutes, (route: PublicRouteTypes, key: string) => {
              const { component, path } = route;
              return (
                <Route
                  exact
                  path={ path }
                  key={ key }
                  render={ (route: RouteComponentProps<any, StaticContext, any>) =>
                    this.props.store.auth.token ? (
                      <Redirect to="/profile"/>
                    ) : (
                      <PublicLayout component={ component } route={ route } auth={ this.props.store.auth }/>
                    )
                  }
                />
              )
          }) }

          <Route component={ NotFound } />
        </Switch>
      </BrowserRouter>
    );
  }
}

interface IProps {
  store: IStore
}
interface IState {}

type Props = IProps;
export default withErrorHandler(Layout, Axios);