const initState = {
  data: [],
  selectedNode: {},
  expandedNodes: []
}

// const extendTree = (stateData, parentsId, data) => {
//   if (!stateData.length) {
//     stateData = data
//     return [...data] 
//   }
//   stateData.map(region => {
//     if (region.regionId === parentsId[0]) {
//       // region.children = extendTree(region.children, parentsId.slice(1))
//       return {
//         ...region,
//         children: extendTree(region.children, parentsId.slice(1))
//       }
//     }
//   })
// }

const editTree = (stateData, data, path, context, editId) => {
  stateData.forEach((region, i, arr) => {
    if (region.regionId === path[0]) {
      if (path.length === 1) {
        if (context === 'region') {
          arr[i] = Object.assign({}, data)
          return
        }
        else {
          region[context].forEach((item, i, arr) => {
            if (item.id === editId) {
              arr[i] = Object.assign({}, data)
              return
            }
          })
        }
      }
      editTree(region.children, data, path.slice(1), context, editId)
      return
    }
  })
}

const addToTree = (stateData, data, path, context) => {
  if (!path.length) {
    stateData = [...stateData, data]
    return
  }
  else {
    stateData.forEach((region, i, arr) => {
      if (region.regionId === path[0]) {
        if (path.length === 1) {
          region[context].push(data)
          return
        }
        addToTree(region.children, data, path.slice(1), context)
        return
      }
    })
  }
}

// Reducer
const regionTree = (state = initState, action) => {
  switch (action.type) {
    case 'SET_TREE_DATA':
      return Object.assign({}, state, {
        data: action.payload
      })
    case 'EDIT_TREE_DATA':
      // extendTree(state.data, action.payload.data, action.payload.path)
      editTree(state.data, action.payload.data, action.payload.path, action.payload.context, action.payload.id)
      return Object.assign({}, state, {
        data: [...state.data]
      })
    case 'ADD_TREE_DATA':
      // extendTree(state.data, action.payload.data, action.payload.path)
      addToTree(state.data, action.payload.data, action.payload.path, action.payload.context)
      return Object.assign({}, state, {
        data: [...state.data]
      })
    case 'SET_SELECTED_NODE':
      return Object.assign({}, state, {
        selectedNode: action.payload
      })
    case 'SET_EXPANDED_NODES':
      return Object.assign({}, state, {
        expandedNodes: action.payload
      })
    default:
      return state
  }
}

export default regionTree