export default function productsReducer(state, action) {
  const actions = {
    FETCHING: () => ({ ...state, fetching: action.payload }),
    LOAD: () => ({ ...state, data: [...state.data, ...action.payload] }),
    CLEAR: () => ({ data: [], fetching: true }),
  };
  const actionType = actions[action.type];
  return actionType ? actionType() : state;
};
