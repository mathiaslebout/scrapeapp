import React, { PropTypes, Component } from 'react'
import Palette from './Palette'
import { connect } from 'react-redux'

class Product extends Component {

    render() {
        return (
            <div className='image-gallery-image'>
                <img
                    className="productImage"
                    src={this.props.product.original}
                    alt={this.props.product.originalAlt}
                    srcSet={this.props.product.srcSet}
                    sizes={this.props.product.sizes}
                    // onLoad={this.props.onImageLoad}
                />
            {
                // product description
                this.props.product.description &&
                <span className='image-gallery-description'>
                    {
                        this.props.signed &&
                        <span>
                            {this.props.product.shop}&nbsp;/&nbsp;
                        </span>
                    }
                    <a href={this.props.product.href} target='_blank'>
                        {this.props.product.description}                        
                    </a>
                    {
                        this.props.signed &&
                        <div>
                            Taglie: {this.props.product.sizes.join(',')}
                        </div>
                    }
                    {
                        this.props.signed &&
                        <div>
                            Prezzo: {this.props.product.price} euro
                        </div>
                    }
                </span>
            }
            {
                this.props.signed &&
                <Palette 
                    palette={this.props.product.palette}
                    />
            }
        </div>
        )
        
    }
}

Product.propTypes = {
    product: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
    const signed = state.user.isSigned

    return {
        signed
    } 
}

export default connect(mapStateToProps)(Product) 