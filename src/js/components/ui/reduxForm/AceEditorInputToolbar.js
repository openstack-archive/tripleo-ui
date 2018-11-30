import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'patternfly-react';

const AceEditorInputToolbar = ({
  valid,
  invalid,
  warning,
  error,
  description
}) => (
  <div className="ace-editor-toolbar">
    {invalid && (
      <Fragment>
        <Icon type="pf" name="error-circle-o" /> {error}
      </Fragment>
    )}
    {warning && (
      <Fragment>
        <Icon type="pf" name="warning-triangle-o" /> {warning}
      </Fragment>
    )}
    {valid &&
      !warning &&
      description && (
        <Fragment>
          <Icon type="pf" name="info" /> {description}
        </Fragment>
      )}
  </div>
);
AceEditorInputToolbar.propTypes = {
  description: PropTypes.string,
  error: PropTypes.string,
  invalid: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
  warning: PropTypes.string
};

export default AceEditorInputToolbar;
