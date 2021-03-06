import { combineReducers } from 'redux'
import {
  SELECT_SUBREDDIT, INVALIDATE_SUBREDDIT,
  REQUEST_POSTS, RECEIVE_POSTS,
  REQUEST_PRODUCTS, RECEIVE_PRODUCTS, INVALIDATE_PRODUCTS,
  SET_CURRENT_PRODUCT, SET_CURRENT_PAGE, INCREMENT_PAGE,
  SIGNIN, SIGNED,
  SET_CURRENT_COLOR,
  REQUEST_AVERAGE_COLOR, RECEIVE_AVERAGE_COLOR, RESET_AVERAGE_COLOR,
  DISPLAY_FILTER_PANEL,
} from './actions'

function user(state = {
  isSigning: false,
  isSigned: false,
  auth: null,
  info: null
}, action) {
  switch (action.type) {
    case SIGNIN:
      return Object.assign({}, state, {
        isSigning: action.signin,
        isSigned: false,
        auth: null,
        info: null,
      })
    case SIGNED:
      return Object.assign({}, state, {
        isSigned: action.signed,
        isSigning: false,
        auth: action.auth,
        info: action.info,
      })
    default:
      return state
  }
}

// function currentProduct(state = 0, action) {
//   switch (action.type) {
//     case SET_CURRENT_PRODUCT:
//       return action.index
//     default:
//       return state
//   }
// }

function currentPage(state = 0, action) {
  switch (action.type) {
    case SET_CURRENT_PAGE:
      return action.page
    case INCREMENT_PAGE:
      return action.page + 1 
    default:
      return state
  }
} 

// function signin(state = false, action) {
//   switch (action.type) {
//     case SIGNIN:
//       return !state
//     default:
//       return state
//   }
// }

// function signed(state = false, action) {
//   switch (action.type) {
//     case SIGNED:
//       return !state
//     default:
//       return state
//   }
// }

function selectedSubreddit(state = 'reactjs', action) {
  switch (action.type) {
  case SELECT_SUBREDDIT:
    return action.subreddit
  default:
    return state
  }
}

function selectedColor(state = null, action) {
  switch (action.type) {
    case SET_CURRENT_COLOR:
      return action.color
    default:
      return state
  }
}

function averageColor(state = {
  isFetching: false,
  color: null
}, action) {
  switch (action.type) {
    case RESET_AVERAGE_COLOR:
      return Object.assign({}, state, {
        isFetching: false,
        color: null
      })
    case REQUEST_AVERAGE_COLOR:
      return Object.assign({}, state, {
        isFetching: true
      })
    case RECEIVE_AVERAGE_COLOR:
      return Object.assign({}, state, {
        isFetching: false,
        color: action.color
      })
    default:
      return state
  }
}

function posts(state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) {
  switch (action.type) {
    case INVALIDATE_SUBREDDIT:
      return Object.assign({}, state, {
        didInvalidate: true
      })
    case REQUEST_POSTS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case RECEIVE_POSTS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: action.posts,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}


function products(state = {
    isFetching: false,
    didInvalidate: false,
    items: [],
    prevItems: [],
    currentProduct: 0,
    prevCurrentProduct: null,
}, action) {
    switch (action.type) {
      case INVALIDATE_PRODUCTS:
        return Object.assign({}, state, {
          didInvalidate: true
        })
      case REQUEST_PRODUCTS:
        return Object.assign({}, state, {
          isFetching: true,
          didInvalidate: false,
          items: []
        })
      case RECEIVE_PRODUCTS:
        return Object.assign({}, state, {
          isFetching: false,
          didInvalidate: false,
          items: action.products,
          prevItems: action.prevProducts,
          prevCurrentProduct: action.prevCurrentProduct,
          lastUpdated: action.receivedAt
        })
      case SET_CURRENT_PRODUCT:
        return Object.assign({}, state, {
          currentProduct: action.index
        })
      default:
        return state
    }
}

function postsBySubreddit(state = { }, action) {
  switch (action.type) {
    case INVALIDATE_SUBREDDIT:
    case RECEIVE_POSTS:
    case REQUEST_POSTS:
      return Object.assign({}, state, {
        [action.subreddit]: posts(state[action.subreddit], action)
      })
    default:
      return state
  }
}

function productsByShop(state = {}, action) {
    switch (action.type) {
        case RECEIVE_PRODUCTS:
        case REQUEST_PRODUCTS: 
            return Object.assign({}, state, { products: products(state, action) } )
        default:
            return state
    }
}

function filter(state = {
    filterpanel: false
  }, action) {
    switch (action.type) {
      case DISPLAY_FILTER_PANEL:
        return Object.assign({}, state, {
          filterpanel: action.display
        })
      default:
        return state
    }
}

const rootReducer = combineReducers({
  products,
  currentPage,
  user,
  selectedColor,
  averageColor,
  filter,
})

export default rootReducer