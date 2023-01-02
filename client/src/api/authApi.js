import { post, get } from '../utils/request';
import apiMapper from './apiMapper';

const routes = {
  'login': [post, 'login'],
  'register': [post, 'register'],
  'logout': [post, 'logout'],
  'checkToken': [get, 'check-token'],
};

export const authApi = apiMapper(routes);
