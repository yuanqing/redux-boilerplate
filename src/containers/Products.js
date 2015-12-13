import React, { Component } from 'react';
import DocumentMeta from 'react-document-meta';
import { connect } from 'react-redux';
import fetchData from 'fetch-data';

import { getAllProducts } from '../modules/products'
import Product from '../components/Product';

@fetchData(((getState, dispatch) => {
  return Promise.all([
    dispatch(getAllProducts())
  ]);
}))

@connect(state => ({
  products: state.products
}))

export default class Products extends Component {
  render() {
    var items = this.props.products.items;
    return items && items.length > 0 ? (
      <div className="products">
        <DocumentMeta title="Products" />
        {items.map((product) => {
          return (
            <Product
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
            />
          );
        })}
      </div>
    ) : null;
  }
}
