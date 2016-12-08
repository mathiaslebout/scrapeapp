import React, { PropTypes, Component } from 'react'
import ImageGallery from 'react-image-gallery'
// import GoogleLogin from './GoogleLogin'
import { setCurrentProduct, fetchProductsIfNeeded, invalidateProducts, signin, signed, setCurrentColor, setCurrentPage } from '../actions'
import { connect } from 'react-redux'
import tinycolor from 'tinycolor2'
import convert from 'color-convert'
import DeltaE from 'delta-e'
// import tracking from 'tracking'

// flexbox
// https://philipwalton.github.io/solved-by-flexbox/


class ProductsGallery extends React.Component {
    constructor(props) {
        super(props)
    }

    handleImageLoad(event) {
        console.log('Image loaded ', event.target)
    }

    componentDidMount() {
        const { dispatch, currentProduct } = this.props

        if (currentProduct >= this.props.products.length) 
            this._imageGallery.slideToIndex(0)

        // window.plot = function(x, y, w, h, color) {
        //     var img = document.getElementsByClassName('productImage')[0]
        //     var rect = document.createElement('div')
        //     document.querySelector('#root').appendChild(rect)
        //     rect.classList.add('rect');
        //     rect.style['z-index'] = '4'
        //     rect.style.border = '2px solid ' + color
        //     rect.style.width = w + 'px'
        //     rect.style.height = h + 'px'
        //     rect.style.opacity = '0.5'
        //     rect.style.position = 'absolute'
        //     // rect.style.top = '0px'
        //     // rect.style.left = '0px'
        //     rect.style.background = '#FFFFFF'
        //     rect.style.left = (img.offsetLeft + x) + 'px'
        //     rect.style.top = (img.offsetTop + y) + 'px'
        // };        
    }    

    onSwatchClick(hexColor) {
        const tinyColor = tinycolor(hexColor)
        const rgbColor = tinyColor.toRgb()

        // const analogous = tinyColor.analogous()

        this.props.dispatch(setCurrentPage(0))
        if (this.props.selectedColor) {
            this.props.dispatch(invalidateProducts())
            this.props.dispatch(setCurrentColor(null))

        }  else {
            this.props.dispatch(setCurrentColor(hexColor))
        }

        // window.tracking.ColorTracker.registerColor('test', (r, g, b) => {
        //     if (((r - 10 <= rgbColor.r) && (rgbColor.r <= r + 10)) 
        //         && ((g - 10 <= rgbColor.g) && (rgbColor.g <= g + 10)) 
        //         && ((b - 10 <= rgbColor.b) && (rgbColor.b <= b + 10))) {
        //         return true;
        //     }
        //     return false;
        // });

        // var colors = new window.tracking.ColorTracker(['test']);

        // colors.on('track', function(event) {
        //     if (event.data.length === 0) {
        //         // No colors were detected in this frame.
        //     } else {
        //         event.data.forEach(function(rect) {
        //             // rect.x, rect.y, rect.height, rect.width, rect.color
        //             window.plot(rect.x, rect.y, rect.width, rect.height, rect.color);
        //         });
        //     }
        // });

        // window.tracking.track('.productImage', colors);        
    }

    _renderItem(item) {
        const onImageError = this.props.onImageError || this._handleImageError

        let swatches = []
        if (item.palette) {
            for (let swatch in item.palette) {
                const color = item.palette[swatch]
                const labColor = convert.hex.lab(color)

                let dE = 100
                if (this.props.selectedColor) {
                    const pColor = this.props.selectedColor.substring(1)
                    const pLabColor = convert.hex.lab(pColor)

                    dE = DeltaE.getDeltaE76({L: labColor[0], A: labColor[1], B: labColor[2]}, {L: pLabColor[0], A: pLabColor[1], B: pLabColor[2]})
                }
                
                const s = <span 
                    className="swatch" 
                    key={swatch}
                    style={{ 
                        background: color, 
                        borderColor: dE < 10 ? '#F00' : '#FFF',
                        opacity: this.props.selectedColor && dE >= 10 ? 0.05 : 1
                        }}
                    onClick={this.onSwatchClick.bind(this, color)}
                    />
                swatches.push(s)
            }
        }

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
                this.props.signed && item.palette &&
                <div className="palette">
                    {swatches}
                </div>
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