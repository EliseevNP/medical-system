const initState = {};

const departments = (state = initState, action) => {
  switch (action.type) {
    case 'SET_DEPARTMENTS':
      if (action.payload) {
        return Object.assign({}, state, action.payload);
      } else {
        return {};
      }
    default:
      return state
  }
}

export default departments;