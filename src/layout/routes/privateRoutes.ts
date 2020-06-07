import { Profile } from '../../components/private';

export type ComponentTypes = typeof Profile;
export type PrivateRouteTypes = {
  component: ComponentTypes,
  path: string
}
export default {
  Profile: {
    component: Profile,
    path: '/profile'
  },
};