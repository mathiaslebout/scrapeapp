import fetch from 'isomorphic-fetch'

export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const SELECT_SUBREDDIT = 'SELECT_SUBREDDIT'
export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT'

export const REQUEST_PRODUCTS = 'REQUEST_PRODUCTS'
export const RECEIVE_PRODUCTS = 'RECEIVE_PRODUCTS'

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

function receiveProducts(json) {
    return {
        type: RECEIVE_PRODUCTS,
        products: json,
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

function fetchProducts() {
    return dispatch => {
        dispatch(requestProducts()) 
        return fetch('http://localhost:8082/store', {
                // mode: 'no-cors', 
                // headers: {
                //     'Accept': 'application/json',
                //     'Content-Type': 'application/json'
                // }
            })
            .then(response => response.json())
            .then(json => dispatch(receiveProducts(json)))
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

function shouldFetchProducts(state) {
    const products = state.allProducts
    if (!products || !products.items || products.items.length === 0) {
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

export function fetchProductsIfNeeded() {
    return (dispatch, getState) => {
        if (shouldFetchProducts(getState())) {
            return dispatch(fetchProducts())
        }
    }
}