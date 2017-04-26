import PropTypes from 'prop-types';
import React from 'react';

export default class Plans extends React.Component {

  render() {
    return (
      <div className="row">
        <div className="col-sm-12">
          {this.props.children}
        </div>
      </div>
    );
  }
}

Plans.propTypes = {
  children: PropTypes.node
};
