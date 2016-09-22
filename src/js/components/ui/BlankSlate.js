import React from 'react';

export default class BlankSlate extends React.Component {

  render () {
    return (
      <div className="blank-slate-pf">
        <div className="blank-slate-pf-icon">
          <span className={this.props.iconClass}></span>
        </div>
        <h1>{this.props.title}</h1>
        {this.props.children}
      </div>
    );
  }
}

BlankSlate.propTypes = {
  children: React.PropTypes.node,
  iconClass: React.PropTypes.string,
  title: React.PropTypes.string
};
BlankSlate.defaultProps = {
  iconClass: 'fa fa-ban',
  title: ''
};
