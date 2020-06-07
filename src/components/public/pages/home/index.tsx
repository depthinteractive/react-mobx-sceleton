import React, { Component } from 'react';
import { RouteComponentProps, StaticContext } from 'react-router';

class Home extends Component<Props, IState> {
  render(){
    return(
      <React.Fragment>HOME</React.Fragment>
    );
  }
}

interface IProps {
  route: RouteComponentProps<any, StaticContext, any>;
}
interface IState {}

type Props = IProps;
export default Home;