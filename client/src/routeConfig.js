import { Authentication } from './views/authentication';
import { DashBoard } from './views/dashboard';
import { Access } from './views/access';

export const routeConfig = {
  loginPage: {
    component: Authentication,
    route: '/login',
    exact: true
  },
  dashboardPage: {
    component: DashBoard,
    route: '/',
    exact: true
  },
  assessPage: {
    component: Access,
    route: '/access',
    exact: true
  }
};