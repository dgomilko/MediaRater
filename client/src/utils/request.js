const request = async (method, route, body, options, token) => {
  const headers = {};
  if (method === 'POST')
    headers['Content-Type'] = 'application/json';
  if (token)
    headers['Authorization'] = `Bearer ${token}`;
  const requestInfo = { method, headers };
  if (method === 'POST') {
    requestInfo.body = JSON.stringify(body);
  };
  const url = `${process.env.REACT_APP_SERVER}/api/${route}`;
  try {
    const response = await fetch(url, requestInfo);
    const json = await response.json();
    options.responseHandler(response, json);
  } catch (e) {
    options.errHandler(e);
  } finally {
    if (options.finallyHandler) options.finallyHandler();
  }
};

export const get = (...args) => request('GET', ...args);
export const post = (...args) => request('POST', ...args);

export const throwResError = (json) => {
  const msg = json.message || 'Internal server error';
  throw new Error(msg);
};
