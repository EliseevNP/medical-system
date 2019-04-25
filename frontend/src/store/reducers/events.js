const initState = { data: {}, now: null };

const events = (state = initState, action) => {
  switch (action.type) {
    case 'SET_EVENTS':
      if (action.payload) {
        return Object.assign({}, state, action.payload);
      } else {
        return { data: {}, now: null };
      }
    default:
      return state
  }
}

export default events;