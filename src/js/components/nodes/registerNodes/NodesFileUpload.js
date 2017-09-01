/**
 * Copyright 2017 Red Hat Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import { Button } from 'react-bootstrap';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

const messages = defineMessages({
  invalidJson: {
    id: 'RegisterNodesDialog.invalidJson',
    defaultMessage: 'Invalid JSON'
  },
  csvUnsupported: {
    id: 'RegisterNodesDialog.csvUnsupported',
    defaultMessage: 'CSV Upload Unsupported'
  },
  selectedFileUnsupported: {
    id: 'RegisterNodesDialog.selectedFileUnsupported',
    defaultMessage: 'The selected file format is not supported yet.'
  },
  unsupportedFileFormat: {
    id: 'RegisterNodesDialog.unsupportedFileFormat',
    defaultMessage: 'Unsupported File Format'
  },
  provideCsvOrInstackenvJson: {
    id: 'RegisterNodesDialog.provideCsvOrInstackenvJson',
    defaultMessage: 'Please provide a CSV file or instackenv.json.'
  },
  uploadFromFile: {
    id: 'RegisterNodesDialog.uploadFromFile',
    defaultMessage: 'Upload From File'
  }
});

class NodesFileUpload extends React.Component {
  addNodesFromInstackenvJSON(fileContents) {
    const { addNode, intl: { formatMessage }, notify } = this.props;
    try {
      const nodes = JSON.parse(fileContents).nodes;
      nodes.map(node => addNode(node));
    } catch (e) {
      notify({
        title: formatMessage(messages.invalidJson),
        message: e.toString()
      });
    }
  }

  uploadFromFile(event) {
    const { intl: { formatMessage }, notify } = this.props;
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (f => {
      return e => {
        if (file.name.match(/(\.json)$/)) {
          this.addNodesFromInstackenvJSON(e.target.result);
        } else if (file.name.match(/(\.csv)$/)) {
          // TODO(jtomasek): add CSV file support
          // this.addNodesFromCSV(e.target.result);
          notify({
            title: formatMessage(messages.csvUnsupported),
            message: formatMessage(messages.selectedFileUnsupported)
          });
        } else {
          notify({
            title: formatMessage(messages.unsupportedFileFormat),
            message: formatMessage(messages.provideCsvOrInstackenvJson)
          });
        }
      };
    })(file);
    reader.readAsText(file);
    this.refs.regNodesUploadFileForm.reset();
  }

  render() {
    return (
      <Button onClick={() => this.refs.regNodesUploadFileInput.click()}>
        <span className="fa fa-upload" />
        <FormattedMessage {...messages.uploadFromFile} />

        <form ref="regNodesUploadFileForm">
          <input
            style={{ display: 'none' }}
            ref="regNodesUploadFileInput"
            id="regNodesUploadFileInput"
            type="file"
            accept="text/json"
            onChange={this.uploadFromFile.bind(this)}
          />
        </form>
      </Button>
    );
  }
}
NodesFileUpload.propTypes = {
  addNode: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  notify: PropTypes.func.isRequired
};

export default injectIntl(NodesFileUpload);
