import { Component, PropTypes } from 'react';

export default class App extends Component {
  static propTypes = {
    children: PropTypes.object
  }
  render() {
    return this.props.children;
  }
}

