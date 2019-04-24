const initState = {
  currentLocation: 'lkj'
}

const util = (state = initState, action) => {
  switch (action.type) {
    case 'SET_CURRENT_LOCATION':
      return Object.assign({}, state, {currentLocation: action.currentLocation});
    default:
      return state
  }
}

export default util;