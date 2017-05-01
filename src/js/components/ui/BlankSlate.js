import PropTypes from 'prop-types';
import React from 'react';

export default class BlankSlate extends React.Component {
  render() {
    return (
      <div className="blank-slate-pf">
        <div className="blank-slate-pf-icon">
          <span className={this.props.iconClass} />
        </div>
        <h1>{this.props.title}</h1>
        {this.props.children}
      </div>
    );
  }
}

BlankSlate.propTypes = {
  children: PropTypes.node,
  iconClass: PropTypes.string,
  title: PropTypes.string
};
BlankSlate.defaultProps = {
  iconClass: 'fa fa-ban',
  title: ''
};
