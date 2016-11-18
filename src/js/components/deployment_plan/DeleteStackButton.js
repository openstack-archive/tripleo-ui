import { FormattedMessage } from 'react-intl';
import React from 'react';

import ConfirmationModal from '../ui/ConfirmationModal';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Loader from '../ui/Loader';

export default class DeleteStackButton extends React.Component {
  constructor() {
    super();
    this.state = {
      showDeleteModal: false
    };
  }

  confirmDelete() {
    this.props.deleteStack(this.props.stack);
    this.setState({ showDeleteModal: false });
  }

  render() {
    return (
      <div>
        <button onClick={() => this.setState({ showDeleteModal: true })}
            type="button"
            name="delete"
            disabled={this.props.disabled}
            className="link btn btn-danger">
          <Loader loaded={this.props.loaded}
                  content={this.props.loaderContent}
                  component="span"
                  inline>
            <span className={this.props.buttonIconClass}/> {this.props.content}
          </Loader>
        </button>
        <ConfirmationModal show={this.state.showDeleteModal}
                           title={<FormattedMessage description="Delete Deployment Button"
                                                    id="delete-deployment"
                                                    defaultMessage="Delete Deployment"/>}
                           question={<FormattedMessage
                                       id="are-you-sure-you-want-to-delete-the-stack"
                                       description="Stack deletion confirmation"
                                       defaultMessage="Are you sure you want to delete the stack?"
                                     />}
                           iconClass="pficon pficon-delete"
                           confirmActionName="delete"
                           onConfirm={this.confirmDelete.bind(this)}
                           onCancel={() => this.setState({ showDeleteModal: false })}/>
      </div>
    );
  }
}

DeleteStackButton.propTypes = {
  buttonIconClass: React.PropTypes.string.isRequired,
  content: React.PropTypes.oneOfType([
    React.PropTypes.element,
    React.PropTypes.string
  ]).isRequired,
  deleteStack: React.PropTypes.func.isRequired,
  disabled: React.PropTypes.bool.isRequired,
  loaded: React.PropTypes.bool.isRequired,
  loaderContent: React.PropTypes.oneOfType([
    React.PropTypes.element,
    React.PropTypes.string
  ]).isRequired,
  stack: ImmutablePropTypes.record.isRequired
};
DeleteStackButton.defaultProps = {
  buttonIconClass: 'pficon pficon-delete'
};
