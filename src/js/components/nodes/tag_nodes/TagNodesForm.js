import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import Formsy from 'formsy-react';
import React, { PropTypes } from 'react';

import HorizontalSelect from '../../ui/forms/HorizontalSelect';
import HorizontalInput from '../../ui/forms/HorizontalInput';

const messages = defineMessages({
  confirm: {
    id: 'TagNodesForm.confirm',
    defaultMessage: 'Confirm'
  },
  cancel: {
    id: 'TagNodesForm.cancel',
    defaultMessage: 'Cancel'
  },
  customProfileLabel: {
    id: 'TagNodesForm.customProfileLabel',
    defaultMessage: 'Custom Profile'
  },
  selectProfileLabel: {
    id: 'TagNodesForm.selectProfileLabel',
    defaultMessage: 'Select Profile'
  },
  noProfileOption: {
    id: 'TagNodesForm.noProfileOption',
    defaultMessage: 'No Profile (Untag)'
  },
  customProfileOption: {
    id: 'TagNodesForm.customProfileOption',
    defaultMessage: 'Specify Custom Profile'
  },
  customProfileDescription: {
    id: 'TagNodesForm.customProfileDescription',
    defaultMessage: 'Lowercase with dashes as a separator. E.g. "block-storage"'
  },
  customProfileErrorMessage: {
    id: 'TagNodesForm.customProfileErrorMessage',
    defaultMessage: 'Must be lowercase with dashes as a separator'
  }
});

class TagNodesForm extends React.Component {
  constructor() {
    super();
    this.state = {
      canSubmit: false,
      showCustomInput: false
    };
  }

  enableButton() {
    this.setState({ canSubmit: true });
  }

  disableButton() {
    this.setState({ canSubmit: false });
  }

  checkSelectedProfile(currentValues, isChanged) {
    if (currentValues.profile === 'custom') {
      this.setState({ showCustomInput: true });
    } else {
      this.setState({ showCustomInput: false });
    }
  }

  handleSubmit(formData, resetForm, invalidateForm) {
    const { customProfile, profile } = formData;
    this.props.onSubmit(profile === 'custom' ? customProfile : profile);
  }

  renderOptions() {
    return this.props.profiles
      .map((profile, index) =>
        <option key={index}>{profile}</option>
      ).concat([
        <option key="spacer1" value="spacer" disabled>──────────</option>,
        <option key="noProfile"
                value="">
          {this.props.intl.formatMessage(messages.noProfileOption)}
        </option>,
        <option key="custom"
                value="custom">
          {this.props.intl.formatMessage(messages.customProfileOption)}
        </option>
      ]);
  }

  render() {
    const { formatMessage } = this.props.intl;
    return (
      <Formsy.Form ref="tagNodesForm"
                   className="form form-horizontal"
                   onChange={this.checkSelectedProfile.bind(this)}
                   onSubmit={this.handleSubmit.bind(this)}
                   onValid={this.enableButton.bind(this)}
                   onInvalid={this.disableButton.bind(this)}>
        <div className="modal-body">
          <fieldset>
            <HorizontalSelect name="profile"
                              title={formatMessage(messages.selectProfileLabel)}
                              inputColumnClasses="col-sm-7"
                              labelColumnClasses="col-sm-3"
                              value="">
              {this.renderOptions()}
            </HorizontalSelect>
            {this.state.showCustomInput
              ? <HorizontalInput name="customProfile"
                                 title={formatMessage(messages.customProfileLabel)}
                                 type="text"
                                 inputColumnClasses="col-sm-7"
                                 labelColumnClasses="col-sm-3"
                                 value=""
                                 validations={{ matchRegexp: /^[0-9a-z]+(-[0-9a-z]+)*$/ }}
                                 validationError={formatMessage(messages.customProfileErrorMessage)}
                                 description={formatMessage(messages.customProfileDescription)}
                                 required/>
              : null}
          </fieldset>
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary"
                  disabled={!this.state.canSubmit}
                  type="submit">
            <FormattedMessage {...messages.confirm}/>
          </button>
          <button type="button"
                  className="btn btn-default"
                  aria-label="Close"
                  onClick={this.props.onCancel}>
            <FormattedMessage {...messages.cancel}/>
          </button>
        </div>
      </Formsy.Form>
    );
  }

}
TagNodesForm.propTypes = {
  intl: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  profiles: PropTypes.array.isRequired
};
export default injectIntl(TagNodesForm);
