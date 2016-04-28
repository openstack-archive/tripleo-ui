import React from 'react';
import { Link } from 'react-router';

import StickyFooter from './ui/StickyFooter';

export default class Status extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    var cdate = (new Date(Date.now())).toString();
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
                <div className="led red"></div>
                <h2>Some services are failing.</h2>
                <p>As of <span id="today">{cdate}</span></p>
              </article>
            </section>

            <section className="status">
              <div className="alert alert-danger">
                <span key="keystone_error_icon" className="pficon pficon-error-circle-o"></span>
                Keystone Authentication
              </div>
              <div className="alert alert-warning">
                <span key="tripleo_warning_icon" className="pficon pficon-warning-triangle-o"></span>
                TripleO API
              </div>
              <div className="alert alert-danger">
                <span key="ironic_error_icon" className="pficon pficon-error-circle-o"></span>
                Ironic
              </div>
              <div className="alert alert-danger">
                <span key="heat_error_icon" className="pficon pficon-error-circle-o"></span>
                Heat
              </div>
              <div className="alert alert-success">
                <span key="validations_error_icon" className="pficon pficon-ok"></span>
                Validations
              </div>
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
      <StickyFooter/>
      </div>

    );
  }
}
