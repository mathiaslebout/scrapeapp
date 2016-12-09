import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { fetchProductsIfNeeded, fetchProductsBC, signin, signed } from '../actions'
import ProductsGallery from '../components/ProductsGallery'
import Signin from '../components/Signin'

import "../../node_modules/react-image-gallery/styles/css/image-gallery.css";

class AsyncApp extends Component {
  // constructor(props) {
  //   super(props)
  //   // this.handleChange = this.handleChange.bind(this)
  //   // this.handleRefreshClick = this.handleRefreshClick.bind(this)
  // }

  componentDidMount() {
    // const { dispatch, selectedSubreddit, } = this.props
    const { dispatch } = this.props
    // dispatch(fetchPostsIfNeeded(selectedSubreddit))

    dispatch(fetchProductsIfNeeded())
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedColor !== this.props.selectedColor) {
      const { dispatch, selectedColor } = nextProps
      selectedColor ? dispatch(fetchProductsBC()) : dispatch(fetchProductsIfNeeded())
    }
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

  _onSignIn() {
    this.props.dispatch(signin(true))
  }

  _onSignOut() {
    // console.log('Signing out...')
    switch (this.props.auth) {
    case 'google':
      // sign out from Google
      const auth2 = window.gapi.auth2.getAuthInstance();
      auth2.signOut().then(function () {
        console.log('User logged out from Google')
        this.props.dispatch(signed(false))
      }.bind(this))
      break

    case 'facebook': 
      // sign out from Facebook
      window.FB.logout(function(response) {
        // user is now logged out
        console.log('User logged out from Facebook')
        this.props.dispatch(signed(false))
      }.bind(this))
      break

    default:
      break
    }    
  }

  render() {
    // const { selectedSubreddit, posts, isFetching, lastUpdated } = this.props
    const { products, isFetching } = this.props
    const signClass = this.props.signed ? 'fa fa-sign-out fa-2x' : 'fa fa-sign-in fa-2x' 

    return (
      <div className="app-loader">
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
        {
          // loading 
          isFetching && products.length === 0 &&
          <span className="loading-spinner">
            <i className="fa fa-spinner fa-spin fa-5x fa-fw"></i>
          </span>
        }
        {
          // no products in the store
          !isFetching && products.length === 0 &&
          <h2>Empty.</h2>
        }
        {
          // products gallery
          products.length > 0 && 
          <div style={{ opacity: isFetching ? 0.5 : 1 }}>
            <ProductsGallery products={products} />
          </div>
        }
        { 
          // signin or signout button
          <span className='signin'>
            <div className="signin-icon">
                <i 
                    className={signClass}
                    aria-hidden='true' 
                    onClick={this.props.signed ? this._onSignOut.bind(this) : this._onSignIn.bind(this)}/>
            </div>
            <div>
            {
              this.props.username &&
                <span>
                    <span>Howdy </span> 
                    <span>
                      {this.props.username.split(' ')[0]}
                    </span>
                    <span> !</span>
                </span>
            }
            </div>
          </span>
        }
        {
          <Signin/>
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

const mapStateToProps = (state) => {
  // const { selectedSubreddit, postsBySubreddit } = state

  // products is a Redux reducer defined in reducers.js
  const products = state.products.items
  const isFetching = state.products.isFetching
  const lastUpdated = state.products.lastUpdated
  const signed = state.user.isSigned
  const auth = state.user.auth
  const username = state.user.info ? state.user.info.name : null
  const selectedColor = state.selectedColor

  return {
    // selectedSubreddit,
    products,
    isFetching,
    lastUpdated,
    signed,
    auth,
    username,
    selectedColor,
  }
}

export default connect(mapStateToProps)(AsyncApp)