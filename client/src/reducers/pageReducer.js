export default function pageReducer(state, action) {
  const actions = {
    ADVANCE: { ...state, page: state.page + 1 },
    CLEAR: { page: action?.payload ||  0 },
  };
  const actionType = actions[action.type];
  return actionType || state;
}
