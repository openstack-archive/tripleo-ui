import React from 'react';

export default class DeploymentStep extends React.Component {

  render() {
    let links = !this.props.disabled ? this.props.links : null;
    return (
      <li>
        <h3>
          <span>{this.props.title}</span>
        </h3>
        <div className="row">
          <div className="col-sm-12">
            <div className="deployment-step-subtitle">
              <span>{this.props.subTitle}</span>
              {links}
            </div>
          </div>
          <div className="col-sm-12">
            {this.props.children}
          </div>
        </div>
      </li>
    );
  }
}

DeploymentStep.propTypes = {
  children: React.PropTypes.node,
  disabled: React.PropTypes.bool,
  links: React.PropTypes.array,
  subTitle: React.PropTypes.node,
  title: React.PropTypes.string.isRequired
};

DeploymentStep.defaultProps = {
  disabled: false
};
