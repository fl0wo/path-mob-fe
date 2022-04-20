import {
  Home as HomeIcon,
  BarChartOutlined as DashboardIcon,
  CodeOutlined as CodeIcon,
  GitHub as GitHubIcon,
  Public as PublicIcon,
  PublicOff as PrivateIcon,
  AccountBoxRounded as UserIcon,
  SettingsOutlined as SettingsIcon,
  ListAlt as ListIcon,
  CreditCard as BillingIcon,
  PlusOne as KidRegister,
  Map as MapIcon, LocalActivity, Timer, History
} from '@mui/icons-material';

import { Home } from '../pages/Home';
import AddKid from '../pages/AddKid'

import { Route } from '../types';
import LiveMap from '../pages/LiveMap';
import ActivityHistory from '../pages/ActivityHistory';
import ActivityCurrent from '../pages/ActivityCurrent';

const routes: Array<Route> = [
  {
    key: 'router-home',
    title: 'Home',
    description: 'Home',
    component: LiveMap,
    path: '/',
    isEnabled: true,
    icon: HomeIcon,
    appendDivider: true,
    isLoginRequired: false
  },
  {
    key: 'router-livemap',
    title: 'Live Map',
    description: 'Live Map',
    path: '/map-live',
    isEnabled: true,
    icon: MapIcon,
    component: Home,
    appendDivider: true,
    isLoginRequired: false
  },
  {
    key: 'router-my-account',
    title: 'My Account',
    description: 'My Account',
    path: '/account',
    isEnabled: true,
    icon: UserIcon,
    isLoginRequired: false,
    subRoutes: [
      {
        key: 'router-settings',
        title: 'Settings',
        description: 'Account Settings',
        path: '/account/settings',
        isEnabled: true,
        icon: SettingsIcon,
        isLoginRequired: false
      },
      {
        key: 'router-preferences',
        title: 'Preferences',
        description: 'Account Preferences',
        path: '/account/preferences',
        isEnabled: true,
        icon: ListIcon,
        isLoginRequired: false
      },
      {
        key: 'router-billing',
        title: 'Billing',
        description: 'Account Billing',
        path: '/account/billing',
        isEnabled: true,
        icon: BillingIcon,
        isLoginRequired: false
      },
    ],
  },
];

export default routes;
