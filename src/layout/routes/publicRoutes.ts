import { Home } from '../../components/public';

export type ComponentTypes = typeof Home;
export type PublicRouteTypes = {
  component: ComponentTypes,
  path: string
}

export default {
  Home: {
    component: Home,
    path: '/'
  }
};