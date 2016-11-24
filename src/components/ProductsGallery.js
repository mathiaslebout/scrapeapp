import React, { PropTypes, Component } from 'react'
import ImageGallery from 'react-image-gallery'
import { setCurrentProduct, fetchProductsIfNeeded } from '../actions'
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
    }    

    _renderItem(item) {
        const onImageError = this.props.onImageError || this._handleImageError

        // this.props.dispatch(setCurrentProduct(item.index))

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
                item.description &&
                <span className='image-gallery-description'>
                    <a 
                        href={item.href}
                    >
                    {item.description}
                    </a>
                </span>
            }
        </div>
        )
    }    

    _onSlide(index) {
        this.props.dispatch(setCurrentProduct(index))
        this.props.dispatch(fetchProductsIfNeeded())
    }

    render() {
        const images = this.props.products.map((product, i) => {
            return {
                index: i,
                original: product.imgHref,
                thumbnail: product.imgHref,
                originalClass: 'featured-slide',
                thumbnailClass: 'featured-thumb',
                description: `${product.description}`,
                href: product.href,
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

function mapStateToProps(state) {
    const startIndex = state.currentProduct
    const products = state.allProducts.items

    return {
        startIndex,
        products
    }
}

export default connect(mapStateToProps)(ProductsGallery)