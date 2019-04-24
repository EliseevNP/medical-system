const initState = {};

const organizations = (state = initState, action) => {
  switch (action.type) {
    case 'SET_ORGANIZATIONS':
      if (action.payload) {
        return Object.assign({}, state, action.payload);
      } else {
        return {};
      }
    default:
      return state
  }
}

export default organizations;