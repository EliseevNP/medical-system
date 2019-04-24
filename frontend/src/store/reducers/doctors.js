const initState = {};

const doctors = (state = initState, action) => {
  switch (action.type) {
    case 'SET_DOCTORS':
      if (action.payload) {
        return Object.assign({}, state, action.payload);
      } else {
        return {};
      }
    default:
      return state
  }
}

export default doctors;