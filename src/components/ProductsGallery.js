import React, { PropTypes, Component } from 'react'
import ImageGallery from 'react-image-gallery'
import Palette from './Palette'
// import GoogleLogin from './GoogleLogin'
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
        const { currentProduct } = this.props

        if (currentProduct >= this.props.products.length) 
            this._imageGallery.slideToIndex(0)
    }    

    _renderItem(item) {
        // const onImageError = this.props.onImageError || this._handleImageError

        return (
            <div className='image-gallery-image'>
                <img
                    className="productImage"
                    // crossOrigin="Anonymous"
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
                    {
                        this.props.signed &&
                        <span>
                            {item.shop}&nbsp;/&nbsp;
                        </span>
                    }
                    <a href={item.href} target='_blank'>
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
            {
                this.props.signed &&
                <Palette 
                    palette={item.palette}
                    />
            }
        </div>
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
            onImageLoad={this.handleImageLoad}
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
    const startIndex = state.currentProduct
    const products = state.allProducts.items
    const signing = state.user.isSigning
    const signed = state.user.isSigned
    const selectedColor = state.selectedColor
    const currentProduct = state.currentProduct

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