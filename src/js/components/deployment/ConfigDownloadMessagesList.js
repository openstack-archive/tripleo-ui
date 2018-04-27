/**
 * Copyright 2018 Red Hat Inc.
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

import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class ConfigDownloadMessagesList extends Component {
  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    this.messagesEnd && this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
  };

  render() {
    const { messages } = this.props;
    return messages.length > 0 ? (
      <div className="flex-container">
        <pre className="flex-column config-download-output">
          {messages.join()}
          <div ref={el => (this.messagesEnd = el)} />
        </pre>
      </div>
    ) : null;
  }
}
ConfigDownloadMessagesList.propTypes = {
  messages: PropTypes.array.isRequired
};
ConfigDownloadMessagesList.defaultProps = {
  messages: []
};
