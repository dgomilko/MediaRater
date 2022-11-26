export default function userReducer(state, action) {
  const actions = {
    SET_INFO: () => ({ ...state, ...action.payload }),
    CLEAR: () => ({ id: null, expired: false }),
  };
  const actionType = actions[action.type];
  return actionType ? actionType() : state;
};
