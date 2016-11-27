import React, { PropTypes, Component } from 'react'
import ImageGallery from 'react-image-gallery'
// import GoogleLogin from './GoogleLogin'
import { setCurrentProduct, fetchProductsIfNeeded, signin, signed } from '../actions'
import { connect } from 'react-redux'


class ProductsGallery extends React.Component {
    constructor(props) {
        super(props)
    }

    handleImageLoad(event) {
        console.log('Image loaded ', event.target)
    }

    componentDidMount() {
        const { dispatch, currentProduct } = this.props

        window.gapi.signin2.render('my-signin2', {
            'scope': 'profile email',
            'width': 250,
            'height': 50,
            'longtitle': true,
            'theme': 'light',   // 'dark'
            'onsuccess': this.responseGoogle.bind(this),
            'onfailure': this.responseGoogle.bind(this)
        });        
    }    

    responseGoogle(response) {
        console.log(response);
        if (this.props.signin) {
            this.props.dispatch(signin())
        }
        if (!this.props.signed) {
            this.props.dispatch(signed())
        }
    }

    _renderItem(item) {
        const onImageError = this.props.onImageError || this._handleImageError

        return (
            <div className='image-gallery-image'>
                <img
                    src={item.original}
                    // width='150px !important'
                    // max-width='150px'
                    alt={item.originalAlt}
                    srcSet={item.srcSet}
                    sizes={item.sizes}
                    onLoad={this.props.onImageLoad}
                    // onError={onImageError.bind(this)}
                />
            {
                // product description
                item.description &&
                <span className='image-gallery-description'>
                    <a href={item.href}>
                        {item.description}
                    </a>
                    {
                        this.props.signed &&
                        <div>
                            Taglie: {item.sizes.join(',')}
                        </div>
                    }
                    {
                        this.props.signed &&
                        <div>
                            Prezzo: {item.price} euro
                        </div>
                    }
                </span>
            }
        </div>
        )
    }    

    _onSlide(index) {
        this.props.dispatch(setCurrentProduct(index))
        this.props.dispatch(fetchProductsIfNeeded())
    }

    _onSigned() {
        this.props.dispatch(signin())
        this.props.dispatch(signed())
    }

    _onSignIn() {
        // console.log('Signing in...')
        this.props.dispatch(signin())
    }

    _onSignOut() {
        // console.log('Signing out...')
        const auth2 = window.gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            console.log('User signed out.')
            this.props.dispatch(signed())
        }.bind(this))
    }

    render() {
        // const onSignIn = this._onSignIn.bind(this)
        const images = this.props.products.map((product, i) => {
            return {
                index: i,
                original: product.imgHref,
                thumbnail: product.imgHref,
                originalClass: 'featured-slide',
                thumbnailClass: 'featured-thumb',
                description: `${product.description}`,
                href: product.href,
                price: product.price,
                sizes: product.sizes,
                // onSignIn
            }
        })

    // const images = [{
    //     original: 'http://lorempixel.com/1000/600/nature/1/',
    //     thumbnail: 'http://lorempixel.com/250/150/nature/1/',
    //     originalClass: 'featured-slide',
    //     thumbnailClass: 'featured-thumb',
    //     originalAlt: 'original-alt',
    //     thumbnailAlt: 'thumbnail-alt',
    //     thumbnailLabel: 'Optional',
    //     description: 'Optional description...',
    //     srcSet: 'Optional srcset (responsive images src)',
    //     sizes: 'Optional sizes (image sizes relative to the breakpoint)'
    // }, {
    //     original: 'http://lorempixel.com/1000/600/nature/2/',
    //     thumbnail: 'http://lorempixel.com/250/150/nature/2/'
    // }, {
    //     original: 'http://lorempixel.com/1000/600/nature/3/',
    //     thumbnail: 'http://lorempixel.com/250/150/nature/3/'        
    // }]

    const signinDisplay = this.props.signin ? 'inherit' : 'none'
    const signinStyle = {
        'display': signinDisplay,
        // 'z-index': this.props.signin ? 3 : 0 
    }

    const signClass = this.props.signed ? 'fa fa-sign-out fa-3x' : 'fa fa-sign-in fa-3x' 

    return (
        <div>
            <ImageGallery
                ref={i => this._imageGallery = i}
                items={images}
                slideInterval={2000}
                onImageLoad={this.handleImageLoad}
                renderItem={this._renderItem.bind(this)}
                showFullscreenButton={false}
                onSlide={this._onSlide.bind(this)}
                // onSignIn={this._onSignIn.bind(this)}
                startIndex={this.props.startIndex}
                lazyLoad={true}
                showNav={true}
                showThumbnails={false}
                showPlayButton={false}
                // signin={this.props.signin}
                />
        { 
            // signin icon t
            <span className='signin'>
                <i 
                    className={signClass}
                    aria-hidden='true' 
                    onClick={this.props.signed ? this._onSignOut.bind(this) : this._onSignIn.bind(this)}/>
            </span>
        }
        {
            // this.props.signin &&
            <span 
                className="signin-panel-background"
                style={signinStyle}
                >
                <span className="signin-panel">
                    {
                    <div className="signin-panel-close">
                        <i 
                            className="fa fa-window-close-o fa-3x" 
                            aria-hidden="true"
                            onClick={this._onSignIn.bind(this)} 
                            />
                    </div>
                    }
                    <div className="signin-google">
                    {
                        <div id="my-signin2" />
                        // <GoogleLogin
                        //     className="g-signin2"
                        //     // data-width="300" data-height="200" data-longtitle="true"
                        //     clientId="940726012646-uesv36pb2rud8kj908oaj7ll5e5qee50.apps.googleusercontent.com"
                        //     // buttonText="Login"
                        //     data-onsuccess={this.responseGoogle.bind(this)}
                        //     onSuccess={this.responseGoogle.bind(this)}
                        //     onFailure={this.responseGoogle.bind(this)}
                        // />
                    }
                    </div>                    
                </span>
            </span>
        }
            
        </div>            
        );        
    }
}

ProductsGallery.propTypes = {
    startIndex: PropTypes.number,
    products: PropTypes.array.isRequired
}

function mapStateToProps(state) {
    const startIndex = state.currentProduct
    const products = state.allProducts.items
    const signin = state.signin
    const signed = state.signed

    return {
        startIndex,
        products,
        signin,
        signed
    }
}

export default connect(mapStateToProps)(ProductsGallery)