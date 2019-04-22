import languageCfg from 'config/language'

const initState = {
  accessToken: null,
  refreshToken: null,
  expiresIn: null,
  data: {
    id: null,
    regionId: null,
    role: 'admin',
    email: null,
    username: null,
    phone: null,
    data: {
      language: languageCfg.default
    }
  }
}

const user = (state = initState, action) => {
  switch (action.type) {
    case 'SET_ACCESS_TOKEN':
      return Object.assign({}, state, {
        accessToken: action.payload
      })
    case 'SET_REFRESH_TOKEN':
      return Object.assign({}, state, {
        refreshToken: action.payload
      })
    case 'SET_EXPIRES_IN':
      return Object.assign({}, state, {
        expiresIn: action.payload
      })
    case 'SET_ID':
      return Object.assign({}, state, {
        data: {
          ...state.data,
          id: action.payload
        } 
      })
    case 'SET_REGION_ID':
      return Object.assign({}, state, {
        data: {
          ...state.data,
          regionId: action.payload
        }
      })
    case 'SET_ROLE':
      return Object.assign({}, state, {
        data: {
          ...state.data,
          role: action.payload
        }
      })
    case 'SET_EMAIL':
      return Object.assign({}, state, {
        data: {
          ...state.data,
          email: action.payload
        }
      })
    case 'SET_USERNAME':
      return Object.assign({}, state, {
        data: {
          ...state.data,
          username: action.payload
        }
      })
    case 'SET_PHONE':
      return Object.assign({}, state, {
        data: {
          ...state.data,
          phone: action.payload
        }
      })
    case 'SET_LANGUAGE':
      return Object.assign({}, state, {
        data: {
          ...state.data,
          data: {
            ...state.data.data,
            language: action.payload 
          }
        }
      })
    default:
      return state
  }
}

export default user
