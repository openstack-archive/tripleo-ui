import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import Formsy from 'formsy-react';
import React from 'react';

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
  selectProfileLabel: {
    id: 'TagNodesForm.selectProfileLabel',
    defaultMessage: 'Select Profile'
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
    console.log(currentValues);
    if (currentValues.profile === 'custom') {
      this.setState({ showCustomInput: true });
    } else {
      this.setState({ showCustomInput: false });
    }
  }

  handleSubmit(formData, resetForm, invalidateForm) {
    console.log(formData);
    const { customProfile, profile } = formData;
    this.props.onSubmit(profile === 'custom' ? customProfile : profile);
  }

  render() {
    const options = this.props.profiles.concat([
      { label: 'Specify Custom Profile', value: 'custom' },
      { label: 'Remove Profile', value: false }
    ]);
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
                              title={this.props.intl.formatMessage(messages.selectProfileLabel)}
                              inputColumnClasses="col-sm-7"
                              labelColumnClasses="col-sm-3"
                              value={undefined}
                              options={options}
                              required/>
            {this.state.showCustomInput
              ? <HorizontalInput name="customProfile"
                                 title="Custom Profile"
                                 type="text"
                                 inputColumnClasses="col-sm-7"
                                 labelColumnClasses="col-sm-3"/>
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
  intl: React.PropTypes.object.isRequired,
  onCancel: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired,
  profiles: React.PropTypes.array.isRequired
};
export default injectIntl(TagNodesForm);
