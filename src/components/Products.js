import React, { PropTypes, Component } from 'react'

export default class Products extends Component {
  render() {
    return (
      <ul>
        {this.props.products.map((product, i) =>
          <li key={product.id}>
          ({product.category}) <a href={ `${product.href}` }>{product.description}</a>, {product.price} euro
          {product.imgHref && 
          <img width='100' src={`${product.imgHref}`} />
          }
          </li>
        )}
      </ul>
    )
  }
}

Products.propTypes = {
  products: PropTypes.array.isRequired
}