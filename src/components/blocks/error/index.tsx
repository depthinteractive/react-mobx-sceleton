import React, { Component } from 'react';
// core
import { IResponseError } from '../../../core/Response';

export default class Error extends Component<Props, IState> {
  shouldComponentUpdate (nextProps: IProps, nextState: IState) {
    return nextProps.errors !== this.props.errors && nextProps.errors !== null;
  }
  
  render = () => (<div>Error here</div>);
}

interface IProps {
  errors: IResponseError[] | null;
  hideError: () => void;
}
interface IState {}

type Props = IProps;