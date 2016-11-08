import React, { PropTypes, Component } from 'react'
import ImageGallery from 'react-image-gallery'

export default class ProductsGallery extends React.Component {

    handleImageLoad(event) {
        console.log('Image loaded ', event.target)
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
                item.description &&
                <span className='image-gallery-description'>
                {item.description}
                </span>
            }
        </div>
        )
    }    

    render() {
        const images = this.props.products.map((product, i) => {
            return {
                original: product.imgHref,
                thumbnail: product.imgHref,
                originalClass: 'featured-slide',
                thumbnailClass: 'featured-thumb',
                description: `${product.shop} ${product.description} ${product.price} euro`,
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
            // renderItem={this._renderItem.bind(this)}
            />
        );        
    }
}

ProductsGallery.propTypes = {
  products: PropTypes.array.isRequired
}