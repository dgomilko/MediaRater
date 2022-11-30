import { post } from '../utils/request';
import apiMapper from './apiMapper';
import { types } from '../utils/productTypes';

const postApiMapper = routes => {
  const mapped = Object.entries(routes)
    .reduce((obj, [fnName, route]) => (
      { ...obj, [fnName]: [post, route] }
    ), {});
  return apiMapper(mapped);  
}

const routes = {
  'userDesc': 'user/profile',
  ...types.reduce((obj, t) => ({
      ...obj,
      [`${t}Desc`]: `product/${t}-desc`,
      [`${t}Recs`]: `recommend/rec-${t}s`,
      [`user${t}Reviews`]: `user/${t}-reviews`,
      [`${t}Reviews`]: `product/${t}-reviews`,
      [`${t}Stats`]: `product/${t}-stats`,
      [`${t}ReviewAdd`]: `product/new-${t}-review`,
      [`${t}s`]: `${t}s`,
    }), {}),
};

export const mainApi = postApiMapper(routes);
