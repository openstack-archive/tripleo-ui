import ClassNames from 'classnames';
import React, { PropTypes } from 'react';

export default class TabPane extends React.Component {
  renderChildren() {
    if (this.props.renderOnlyActive) {
      return this.props.isActive ? this.props.children : null;
    }
    return this.props.children;
  }

  render() {
    let classes = ClassNames({
      'tab-pane': true,
      active: this.props.isActive
    });

    return (
      <div className={classes}>
        {this.renderChildren()}
      </div>
    );
  }
}
TabPane.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  isActive: PropTypes.bool.isRequired,
  renderOnlyActive: PropTypes.bool.isRequired
};
TabPane.defaultProps = {
  renderOnlyActive: false
};
