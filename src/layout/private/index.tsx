import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { StaticContext } from 'react-router';
// types
import { ComponentTypes } from '../routes/privateRoutes';
// store
import { IAuth } from '../../store/auth';
// hoc
import { Aux } from '../../core/aux';

export default class PrivateLayout extends Component<Props, IState> {
  render() {
    const Component = this.props.component;
    const route = this.props.route;
    
    return (
      <Aux>
        <Component route={ route }/>
      </Aux>
    );
  }
}

interface IProps {
  component: ComponentTypes;
  route: RouteComponentProps<any, StaticContext, any>;
  auth: IAuth;
}
interface IState {}

type Props = IProps;