const setOrganizations = (organizations) => {
  return {
    type: 'SET_ORGANIZATIONS',
    payload: organizations
  }
}

export default {
  setOrganizations
}