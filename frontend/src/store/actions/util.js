const setCurrentLocation = (currentLocation) => {
  return {
    type: 'SET_CURRENT_LOCATION',
    currentLocation: currentLocation
  }
}

export default {
  setCurrentLocation
}