import React, { PropTypes, Component } from 'react'
import Palette from './Palette'
import { connect } from 'react-redux'
import { fetchAverageColor } from '../actions'
// import paper from 'paper'

class Product extends Component {
    componentDidUpdate() {
        // let canvas = document.getElementById(`canvas-${this.props.product.index}`)
        // paper.setup(canvas)

        // const raster = new paper.Raster(document.getElementById(`image-${this.props.product.index}`))
        // raster.onLoad = function() {
        //     canvas.width = raster.width
        //     canvas.height = raster.height
        //     // raster.position = paper.view.center

        //     const color = raster.getAverageColor(new paper.Rectangle(raster.width / 2, raster.height / 2, 10, 10))
        //     console.log(color)
        // }

        // let img = new Image()
        // img.src = this.props.product.original
        // let canvas = document.getElementById(`canvas-${this.props.product.index}`)
        // const ctx = canvas.getContext('2d');
        // img.onload = function() {
        //     canvas.width = img.width
        //     canvas.height = img.height
        //     ctx.drawImage(img, 0, 0)
        //     img.style.display = 'none'
        // };        
        // canvas.addEventListener('mousemove', this.pick.bind(this))
    }

    pick(event) {
        let canvas = document.getElementById(`canvas-${this.props.product.index}`)
        const ctx = canvas.getContext('2d');

        var x = event.layerX
        var y = event.layerY
        var pixel = ctx.getImageData(x, y, 1, 1)
        var data = pixel.data
        var rgba = 'rgba(' + data[0] + ',' + data[1] +
                    ',' + data[2] + ',' + (data[3] / 255) + ')'
    }

    onClickHandler(event) {
        // console.log(JSON.stringify(event, null, '\t'))
        // event.clientX / event.clientY to get the X/Y coordinates 
        // event.offsetLeft / event.offsetTop to be summed to get coordinates on image
        // => event.clientX + event.offsetLeft / event.offsetY + event.offsetTop
        // event.offsetWidth / event.offsetHeight to get the dimensions of the image
        // pass all the info to REST API to get average color there
        const imgPoint = {
            x: - event.target.offsetLeft + event.clientX,
            y: - event.target.offsetTop + event.clientY
        }

        const imgDim = {
            width: event.target.offsetWidth,
            height: event.target.offsetHeight
        }

        console.log(`imgPoint: ${JSON.stringify(imgPoint, null, '\t')}, imgDim: ${JSON.stringify(imgDim, null, '\t')}`)

        this.props.dispatch(fetchAverageColor(this.props.product._id, imgPoint, imgDim))
    }

    render() {
        return (
            <div className='image-gallery-image'>
            {
                /*
                <canvas 
                    className='image-gallery-canvas'
                    id={`canvas-${this.props.product.index}`}
                />
                */
            }
            {
                <img
                    // crossOrigin="anonymous"
                    id={`image-${this.props.product.index}`}
                    className="productImage"
                    src={this.props.product.original}
                    alt={this.props.product.originalAlt}
                    srcSet={this.props.product.srcSet}
                    sizes={this.props.product.sizes}
                    onClick={this.onClickHandler.bind(this)}            
                    // onLoad={this.props.onImageLoad}
                />
            }
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
    const averageColor = state.averageColor

    return {
        signed,
        averageColor
    } 
}

export default connect(mapStateToProps)(Product) 