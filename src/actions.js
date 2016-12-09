import fetch from 'isomorphic-fetch'

export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const SELECT_SUBREDDIT = 'SELECT_SUBREDDIT'
export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT'

export const REQUEST_PRODUCTS = 'REQUEST_PRODUCTS'
export const RECEIVE_PRODUCTS = 'RECEIVE_PRODUCTS'
export const INVALIDATE_PRODUCTS = 'INVALIDATE_PRODUCTS'

export const SET_CURRENT_PRODUCT = 'SET_CURRENT_PRODUCT'
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE'
export const INCREMENT_PAGE = 'INCREMENT_PAGE'

export const SET_CURRENT_COLOR = 'SET_CURRENT_COLOR'

export const SIGNIN = 'SIGNIN'
export const SIGNED = 'SIGNED'

export function setCurrentColor(color) {
  return {
    type: SET_CURRENT_COLOR,
    color
  }
}

export function setCurrentProduct(index) {
  return {
    type: SET_CURRENT_PRODUCT,
    index
  }
}

export function setCurrentPage(page) {
  return {
    type: SET_CURRENT_PAGE,
    page
  }
}

export function incrementPage(page) {
  return {
    type: INCREMENT_PAGE,
    page
  }
}

export function signin(signin) {
  return {
    type: SIGNIN,
    signin
  }
}

export function signed(signinfo) {
  return {
    type: SIGNED,
    signed: signinfo.signed,
    auth: signinfo.auth,
    info: signinfo.info
  }
}

export function selectSubreddit(subreddit) {
  return {
    type: SELECT_SUBREDDIT,
    subreddit
  }
}

export function invalidateSubreddit(subreddit) {
  return {
    type: INVALIDATE_SUBREDDIT,
    subreddit
  }
}

export function invalidateProducts() {
  return {
    type: INVALIDATE_PRODUCTS
  }
}

function requestPosts(subreddit) {
  return {
    type: REQUEST_POSTS,
    subreddit
  }
}

function requestProducts() {
    return {
        type: REQUEST_PRODUCTS
    }
}

function receivePosts(subreddit, json) {
  return {
    type: RECEIVE_POSTS,
    subreddit,
    // posts: json.data.children.map(child => child.data),
    posts: json,
    receivedAt: Date.now()
  }
}

function receiveProducts(json, products) {
    return {
        type: RECEIVE_PRODUCTS,
        products:  products.concat( json ),
        receivedAt: Date.now()
    }
}

function fetchPosts(subreddit) {
  return dispatch => {
    dispatch(requestPosts(subreddit))
    return fetch(`http://www.reddit.com/r/${subreddit}.json`)
      .then(response => response.json())
      .then(json => dispatch(receivePosts(subreddit, json)))
  }
}

function fetchProducts(state) {
    return dispatch => {
        dispatch(requestProducts()) 

        let baseUrl = process.env.NODE_ENV !== 'production' ? 'http://localhost:8082' : 'http://35.164.227.19:8082'
        return fetch(`${baseUrl}/store/${state.currentPage}`, {                    
                // mode: 'no-cors', 
                // headers: {
                //     'Accept': 'application/json',
                //     'Content-Type': 'application/json'
                // }
            })
            .then(response => response.json())
            .then(json => {
              dispatch(receiveProducts(json, state.allProducts.didInvalidate ? [] : state.allProducts.items))
            })
    }
}

function fetchProductsByColor(state) {
  return dispatch => {
    dispatch(requestProducts())

    let baseUrl = process.env.NODE_ENV !== 'production' ? 'http://localhost:8082' : 'http://35.164.227.19:8082'
    return fetch(`${baseUrl}/store/color/${state.selectedColor.substring(1)}`, )
      .then(response => response.json())
      .then(json => dispatch(receiveProducts(json, [])))
  }
}

function shouldFetchPosts(state, subreddit) {
  const posts = state.postsBySubreddit[subreddit]
  if (!posts) {
    return true
  } else if (posts.isFetching) {
    return false
  } else {
    return posts.didInvalidate
  }
}

function shouldFetchProducts(dispatch, state) {
    const products = state.allProducts
    if (state.selectedColor) {
      return false      
    } if (!products || !products.items || products.items.length === 0) {
        return true
    } else if (products.items.length === state.currentProduct + 5) {
        dispatch(incrementPage(state.currentPage))
        return true        
    } else if (products.isFetching) {
        return false
    } else {
        return products.didInvalidate
    }
}

export function fetchPostsIfNeeded(subreddit) {
  return (dispatch, getState) => {
    if (shouldFetchPosts(getState(), subreddit)) {
      return dispatch(fetchPosts(subreddit))
    }
  }
}

export function fetchProductsBC() {
  return (dispatch, getState) => {
    return dispatch(fetchProductsByColor(getState()))
  }
}


export function fetchProductsIfNeeded() {
    return (dispatch, getState) => {
        if (shouldFetchProducts(dispatch, getState())) {
            return dispatch(fetchProducts(getState()))
        }
    }
}