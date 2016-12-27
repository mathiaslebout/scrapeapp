import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { displayFilterPanel } from '../actions'

class FilterPanel extends Component {

    componentDidMount() {

    }

    _onClosePanel() {
        this.props.dispatch(displayFilterPanel(false))
    }

    render() {
        return (
            <div className="filter-panel">
                <div className="filter-panel-close">
                    <i 
                        className="fa fa-window-close-o fa-2x" 
                        aria-hidden="true"
                        onClick={this._onClosePanel.bind(this)} 
                        />
                </div>
                <form>
                    <input type="checkbox" id="mango"/><label htmlFor="mango">Mango</label><br/>
                    <input type="checkbox" id="zara"/><label htmlFor="zara">Zara</label><br/>
                    <input type="checkbox" id="promod"/><label htmlFor="promod">Promod</label><br/>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const { filterpanel } = state.filter.filterpanel

    return {
        filterpanel
    }
}

export default connect(mapStateToProps)(FilterPanel)