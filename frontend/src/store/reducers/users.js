const initState = {}

const users = (state = initState, action) => {
  switch (action.type) {
    case 'SET_USERS':
      if (action.payload) {
        return Object.assign({}, state, action.payload);
      } else {
        return Object.assign({});
      }
    default:
      return state
  }
}

export default users