const initState = {
  isAuthorized: false
}

const user = (state = initState, action) => {
  switch (action.type) {
    case 'SET_USER':
      if (action.payload) {
        return Object.assign({}, state, action.payload, { isAuthorized: true });
      } else {
        return Object.assign({ isAuthorized: false });
      }
    default:
      return state
  }
}

export default user
