import ClassNames from 'classnames';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import React from 'react';

import ApiStatusConstants from '../../constants/ApiStatusConstants';
import StickyFooter from '../ui/StickyFooter';

class ApiStatusItem extends React.Component {
  render() {
    let connectionStatus, statusText;

    if(!this.props.data) {
      return null;
    }

    let classes = ClassNames({
      'alert': true,
      'alert-danger': this.props.data.success === false,
      'alert-success': this.props.data.success,
      'alert-info': this.props.data.isLoading === true,
    });

    let iconClasses = ClassNames({
      'pficon': true,
      'pficon-error-circle-o': this.props.data.success === false,
      'pficon-ok': this.props.data.success,
      'pficon-info': this.props.data.isLoading === true
    });

    if(this.props.data.isLoading === true) {
      connectionStatus = 'Loading...';
    }
    else {
      connectionStatus = this.props.data.status === 0
        ? 'No Connection (CORS not configured, API down or host not available)'
        : this.props.data.status ? this.props.data.status : 'OK';
    }
    statusText = this.props.data.statusText ? (
        <p>{this.props.data.statusText}</p>
    ) : null;
    return (
      <div className={classes}>
        <span className={iconClasses}></span>
        <p><strong>{this.props.name}</strong> {connectionStatus}</p>
        {statusText}
      </div>
    );
  }
}

const Status = (props) => {
  return (
    <div>
    <header>
      <nav className="navbar navbar-default navbar-pf navbar-fixed-top" role="navigation">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle collapsed"
                  data-toggle="collapse" data-target="#tripleo-navbar-collapse"
                  aria-expanded="false">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <Link className="navbar-brand" to="/">
              <img src="/img/tripleo-owl.svg" alt="TripleO"></img>
          </Link>
        </div>
        <div className="navbar-collapse collapse" id="tripleo-navbar-collapse">
        </div>
      </nav>
    </header>
    <div className="wrapper-fixed-body container-fluid">
      <div className="row">
        <div className="col-sm-12 col-lg-9">
          <section className="status-button">
            <article>
              <h2>Service Status</h2>
              <p>As of <span id="today">{(new Date(Date.now())).toString()}</span></p>
            </article>
          </section>

          <section className="status">
            <ApiStatusItem name="Keystone API" data={props.items.get(ApiStatusConstants.KEYSTONE)}/>
            <ApiStatusItem name="TripleO API" data={props.items.get(ApiStatusConstants.TRIPLEO)}/>
            <ApiStatusItem name="Ironic API" data={props.items.get(ApiStatusConstants.IRONIC)}/>
            <ApiStatusItem name="Validations API"
                           data={props.items.get(ApiStatusConstants.VALIDATIONS)}/>
            <ApiStatusItem name="Heat API" data={props.items.get(ApiStatusConstants.HEAT)}/>
          </section>

          <section className="legend">
            <article>
              <div className="legend-colour green"></div>
              <p>Working fine</p>

              <div className="legend-colour yellow"></div>
              <p>Possible issue</p>

              <div className="legend-colour red"></div>
              <p>Service failing</p>
            </article>
          </section>
        </div>
      </div>
    </div>
    <StickyFooter />
    </div>
  );
}

Status.propTypes = {
items: ImmutablePropTypes.map.isRequired
};

export default Status
