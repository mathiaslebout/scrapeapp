import React, { PropTypes, Component } from 'react'
import ImageGallery from 'react-image-gallery'
import Product from './Product'
import { setCurrentProduct, fetchProductsIfNeeded } from '../actions'
import { connect } from 'react-redux'

// flexbox
// https://philipwalton.github.io/solved-by-flexbox/

class ProductsGallery extends Component {
    // constructor(props) {
    //     super(props)
    // }

    handleImageLoad(event) {
        console.log('Image loaded ', event.target)
    }

    componentDidMount() {
        const { selectedColor, currentProduct } = this.props

        if (!selectedColor) {
            this._imageGallery.slideToIndex(currentProduct)
        } 
    }    

    componentDidUpdate() {
        // const { selectedColor, currentProduct } = this.props

        // if (!selectedColor) {
        //     this._imageGallery.slideToIndex(currentProduct)
        // }
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     return true;
    // }

    _renderItem(item) {
        // const onImageError = this.props.onImageError || this._handleImageError

        return (
            <Product
                product={item}
                />
        )
    }    

    _onSlide(index) {
        this.props.dispatch(setCurrentProduct(index))
        this.props.dispatch(fetchProductsIfNeeded())
    }

    render() {
        // const onSignIn = this._onSignIn.bind(this)
        const images = this.props.products.map((product, i) => {
            let imgHref = product.imgHref
            // if (imgHref.indexOf('top-lingerie--pp513353-s5-produit-493x530') != -1) 
            //     imgHref = 'top-lingerie--pp513353-s5-produit-493x530.jpg'

            return {
                index: i,
                _id: product._id,
                original: imgHref,
                // thumbnail: imgHref,
                originalClass: 'featured-slide',
                thumbnailClass: 'featured-thumb',
                description: `${product.description}`,
                href: product.href,
                price: product.price,
                sizes: product.sizes,
                palette: product.palette,
                shop: product.shop,
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

    return (
        <ImageGallery
            ref={i => this._imageGallery = i}
            items={images}
            slideInterval={2000}
            onImageLoad={this.handleImageLoad.bind(this)}
            renderItem={this._renderItem.bind(this)}
            showFullscreenButton={false}
            onSlide={this._onSlide.bind(this)}
            startIndex={this.props.startIndex}
            lazyLoad={true}
            showNav={true}
            showThumbnails={false}
            showPlayButton={false}
            />            
        );        
    }
}

ProductsGallery.propTypes = {
    startIndex: PropTypes.number,
    products: PropTypes.array.isRequired
}

const mapStateToProps = (state) => {
    const startIndex = state.selectedColor ? 0 : state.currentProduct
    const products = state.products.items
    const currentProduct = state.products.currentProduct
    const signing = state.user.isSigning
    const signed = state.user.isSigned
    const selectedColor = state.selectedColor

    return {
        startIndex,
        products,
        signing,
        signed,
        selectedColor,
        currentProduct
    }
}

export default connect(mapStateToProps)(ProductsGallery)