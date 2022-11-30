export default function apiMapper(routes) {
  return Object.entries(routes)
    .reduce((obj, [fnName, [method, route]]) => (
      { ...obj, [fnName]: (...params) => method(route, ...params) }
    ), {});
};