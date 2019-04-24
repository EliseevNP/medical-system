const setDoctors = (doctors) => {
  return {
    type: 'SET_DOCTORS',
    payload: doctors
  }
}

export default {
  setDoctors
}