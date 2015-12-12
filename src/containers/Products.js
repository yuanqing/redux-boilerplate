import React, { Component } from 'react';
import { connect } from 'react-redux';
import fetchData from 'fetch-data';

import { getAllProducts } from '../modules/products'

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
    return null;
  }
}
