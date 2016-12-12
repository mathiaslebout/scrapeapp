import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import convert from 'color-convert'
import DeltaE from 'delta-e'
// import tinycolor from 'tinycolor2'
// import tracking from 'tracking'
import Swipeable from 'react-swipeable'

import { setCurrentPage, setCurrentColor, invalidateProducts, resetAverageColor } from '../actions'

class Palette extends Component {

    componentDidMount() {
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
        // const tinyColor = tinycolor(hexColor)
        // const rgbColor = tinyColor.toRgb()

        // this.props.dispatch(setCurrentPage(0))
        if (this.props.selectedColor) {
            // this.props.dispatch(invalidateProducts())
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

    onSwipedAverageColor(event) {
        if (this.props.averageColor.color !== this.props.selectedColor) {
            this.props.dispatch(resetAverageColor())
        }
    }

    _buildSwatches() {
        let swatches = []
        let averageSwatches = []
        if (!this.props.palette) 
            return swatches

        for (let swatch in this.props.palette) {
            const color = this.props.palette[swatch]
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

        if (this.props.averageColor.color) {
            const labColor = convert.hex.lab(this.props.averageColor.color.substring(1))
            
            let dE = 100
            if (this.props.selectedColor) {
                const pColor = this.props.selectedColor.substring(1)
                const pLabColor = convert.hex.lab(pColor)

                dE = DeltaE.getDeltaE76({L: labColor[0], A: labColor[1], B: labColor[2]}, {L: pLabColor[0], A: pLabColor[1], B: pLabColor[2]})
            }
            
            const s = <span 
                className="swatch" 
                key='averageColor'
                style={{ 
                    background: this.props.averageColor.color, 
                    borderColor: dE < 10 ? '#F00' : '#FFF',
                    opacity: this.props.selectedColor && dE >= 10 ? 0.05 : 1
                }}
                onClick={this.onSwatchClick.bind(this, this.props.averageColor.color)}
                // onDoubleClick={this.onDoubleClickHandler.bind(this)}
                />
            averageSwatches.push(s)
        } 

        return { swatches, averageSwatches }
    }

    render() {
        const { swatches, averageSwatches } = this._buildSwatches()

        return (
            <div>            
                <div className="palette">
                    {swatches}
                </div>
                {
                    this.props.averageColor.isFetching &&
                    <div className="palette-average-fetching">
                        <span>Sto analizzando il colore...</span>
                    </div>
                }
                <Swipeable 
                    // style={{margin: '30px'}}
                    delta={1}
                    className="averageColor-palette"
                    onSwiped={this.onSwipedAverageColor.bind(this)}
                    // onSwipeDown={this.onDoubleClickHandler.bind(this)}
                    // trackMouse={true}
                    // stopPropagation={true}
                    >                
                    {averageSwatches}
                </Swipeable>
            </div>
        )
    }
}

Palette.propTypes = {
    palette: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
    const { selectedColor, averageColor } = state

    return {
        selectedColor,
        averageColor,
    }
}

export default connect(mapStateToProps)(Palette)