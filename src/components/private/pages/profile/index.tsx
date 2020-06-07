import React, { Component } from 'react';
import { RouteComponentProps, StaticContext } from 'react-router';

export default class Profile extends Component<Props, IState> {
  render = () => (<div> Profile o.O</div>);
}

interface IProps {
  route: RouteComponentProps<any, StaticContext, any>;
}
interface IState {}

type Props = IProps;