import { combineReducers } from 'redux'
import {
  SELECT_SUBREDDIT, INVALIDATE_SUBREDDIT,
  REQUEST_POSTS, RECEIVE_POSTS,
  REQUEST_PRODUCTS, RECEIVE_PRODUCTS,
  SET_CURRENT_PRODUCT, SET_CURRENT_PAGE, INCREMENT_PAGE,
  SIGNIN, SIGNED
} from './actions'

function currentProduct(state = 0, action) {
  switch (action.type) {
    case SET_CURRENT_PRODUCT:
      return action.index
    default:
      return state
  }
}

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

function signin(state = false, action) {
  switch (action.type) {
    case SIGNIN:
      return !state
    default:
      return state
  }
}

function signed(state = false, action) {
  switch (action.type) {
    case SIGNED:
      return !state
    default:
      return state
  }
}

function selectedSubreddit(state = 'reactjs', action) {
  switch (action.type) {
  case SELECT_SUBREDDIT:
    return action.subreddit
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

function allProducts(state = {
    isFetching: false,
    didInvalidate: false,
    items: []
}, action) {
    switch (action.type) {
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
                lastUpdated: action.receivedAt
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
            return Object.assign({}, state, { products: allProducts(state, action) } )
        default:
            return state
    }
}

const rootReducer = combineReducers({
  // postsBySubreddit,
//   selectedSubreddit,
  allProducts,
  currentProduct,
  currentPage,
  signin,
  signed,
})

export default rootReducer