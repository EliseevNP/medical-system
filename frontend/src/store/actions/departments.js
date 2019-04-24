const setDepartments = (departments) => {
  return {
    type: 'SET_DEPARTMENTS',
    payload: departments
  }
}

export default {
  setDepartments
}