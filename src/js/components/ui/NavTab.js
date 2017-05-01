import React, { PropTypes } from 'react';
import { Link } from 'react-router';

export default class NavTab extends Link {
  render() {
    let router = this.context.router;
    let isActive = router.isActive(
      { pathname: this.props.to, query: this.props.query },
      this.props.onlyActiveOnIndex
    );
    let className = isActive ? 'active' : '';
    let link = <Link {...this.props} />;
    return <li className={className}>{link}</li>;
  }
}
NavTab.propTypes = {
  onlyActiveOnIndex: PropTypes.bool.isRequired,
  query: PropTypes.object,
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.route]).isRequired
};
NavTab.defaultProps = {
  onlyActiveOnIndex: false
};
NavTab.contextTypes = {
  router: PropTypes.object
};
