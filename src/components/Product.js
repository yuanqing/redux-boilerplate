import React, { Component, PropTypes } from 'react';

export default class Product extends Component {
  render() {
    return (
      <div className="product">
        <h1>{this.props.name}</h1>
        <ul>
          <li>id: {this.props.id}</li>
          <li>description: {this.props.description}</li>
        </ul>
      </div>
    );
  }
}

Product.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};
