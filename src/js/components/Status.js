import React from 'react';
import { Link } from 'react-router';
import Modal from './ui/Modal';

export default class Status extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    var cdate = (new Date(Date.now())).toString();
    return (
      <Modal dialogClasses="modal-lg">
        <div className="modal-header">
          <Link to={this.props.parentPath}
                type="button"
                className="close">
            <span aria-hidden="true" className="pficon pficon-close"/>
          </Link>
          <h4 className="modal-title">Services Status</h4>
        </div>
        <div>
          <div className="row container-fluid">
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
                  <span key="keystone_error_icon" className="pficon pficon-error-circle-o">
                  </span>
                  Keystone Authentication
                </div>
                <div className="alert alert-warning">
                  <span key="tripleo_warning_icon" className="pficon pficon-warning-triangle-o">
                  </span>
                  TripleO API
                </div>
                <div className="alert alert-danger">
                  <span key="ironic_error_icon" className="pficon pficon-error-circle-o">
                  </span>
                  Ironic
                </div>
                <div className="alert alert-danger">
                  <span key="heat_error_icon" className="pficon pficon-error-circle-o">
                  </span>
                  Heat
                </div>
                <div className="alert alert-success">
                  <span key="validations_error_icon" className="pficon pficon-ok">
                  </span>
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
        <div className="modal-footer">
          <Link to={this.props.parentPath}
                type="button"
                className="btn btn-primary">
            Close
          </Link>
        </div>
      </Modal>
    );
  }
}
Status.propTypes = {
  parentPath: React.PropTypes.string.isRequired
};

Status.defaultProps = {
  parentPath: '/deployment-plan'
};
