import React, { PropTypes } from 'react';

export default class App extends React.Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
App.propTypes = {
  children: PropTypes.element
};
