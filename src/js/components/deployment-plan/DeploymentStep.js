import React from 'react';

export default class DeploymentStep extends React.Component {

  render() {
    return (
      <li>
        <h3>
          <span>{this.props.title}</span>
        </h3>
        <div className="row">
          <div className="col-sm-12">
            <div className="deployment-step-subtitle">
              <span>{this.props.subTitle}</span>
              {this.props.links}
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
  links: React.PropTypes.array,
  subTitle: React.PropTypes.string,
  title: React.PropTypes.string.isRequired
};
