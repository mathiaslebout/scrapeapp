import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { selectSubreddit, fetchPostsIfNeeded, invalidateSubreddit, fetchProductsIfNeeded } from '../actions'
import Picker from '../components/Picker'
import Posts from '../components/Posts'
import Products from '../components/Products'
import ProductsGallery from '../components/ProductsGallery'

import "../../node_modules/react-image-gallery/styles/css/image-gallery.css";

class AsyncApp extends Component {
  constructor(props) {
    super(props)
    // this.handleChange = this.handleChange.bind(this)
    // this.handleRefreshClick = this.handleRefreshClick.bind(this)
  }

  componentDidMount() {
    // const { dispatch, selectedSubreddit, } = this.props
    const { dispatch } = this.props
    // dispatch(fetchPostsIfNeeded(selectedSubreddit))
    dispatch(fetchProductsIfNeeded())
  }

  componentWillReceiveProps(nextProps) {
    // if (nextProps.selectedSubreddit !== this.props.selectedSubreddit) {
      // const { dispatch, selectedSubreddit } = nextProps
      // const { dispatch } = nextProps
      // dispatch(fetchPostsIfNeeded(selectedSubreddit))
      // dispatch(fetchProductsIfNeeded())
    // }
  }

  // handleChange(nextSubreddit) {
  //   this.props.dispatch(selectSubreddit(nextSubreddit))
  // }

  // handleRefreshClick(e) {
  //   e.preventDefault()

  //   const { dispatch, selectedSubreddit } = this.props
  //   dispatch(invalidateSubreddit(selectedSubreddit))
  //   dispatch(fetchPostsIfNeeded(selectedSubreddit))
  // }

  render() {
    // const { selectedSubreddit, posts, isFetching, lastUpdated } = this.props
    const { products, isFetching, lastUpdated} = this.props
    return (
      <div>
      {/*
        <Picker value={selectedSubreddit}
                onChange={this.handleChange}
                options={[ 'reactjs', 'frontend' ]} />
        <p>
          {lastUpdated &&
            <span>
              Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
              {' '}
            </span>
          }
          {!isFetching &&
            <a href='#'
               onClick={this.handleRefreshClick}>
              Refresh
            </a>
          }
        </p>
        */}        
        {isFetching && products.length === 0 &&
          <h2>Loading...</h2>
        }
        {!isFetching && products.length === 0 &&
          <h2>Empty.</h2>
        }
        {products.length > 0 && 
          <div style={{ opacity: isFetching ? 0.5 : 1 }}>
            <ProductsGallery products={products} />
          </div>
        }
      </div>
    )
  }
}


AsyncApp.propTypes = {
  // selectedSubreddit: PropTypes.string.isRequired,
  // posts: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  // const { selectedSubreddit, postsBySubreddit } = state

  // allProducts is a Redux reducer defined in reducers.js
  const { allProducts } = state
  const {
    isFetching,
    lastUpdated,
    items: products,
  } = allProducts || {
    isFetching: true,
    items: [],
  }
  // const {
  //   isFetching,
  //   lastUpdated,
  //   items: products
  // } = productsByShop || {
  //   isFetching: true,
  //   items: []
  // }

  return {
    // selectedSubreddit,
    products,
    isFetching,
    lastUpdated
  }
}

export default connect(mapStateToProps)(AsyncApp)