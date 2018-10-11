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

import { connect } from 'react-redux';
import { defineMessages, FormattedMessage } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ListView } from 'patternfly-react';

import {
  CloseModalButton,
  CloseModalXButton,
  RoutedModal
} from '../../ui/Modals';
import { getNodeDrives } from '../../../selectors/nodes';
import NodeDrive from './NodeDrive';
import { fetchNodeIntrospectionData } from '../../../actions/NodesActions';

const messages = defineMessages({
  title: {
    id: 'NodeDrives.title',
    defaultMessage: 'Node Drives - {nodeId}'
  },
  close: {
    id: 'NodeDrives.close',
    defaultMessage: 'Close'
  }
});

class NodeDrives extends Component {
  componentDidMount() {
    this.props.fetchNodeIntrospectionData();
  }

  render() {
    return (
      <RoutedModal bsSize="xl" redirectPath="/nodes">
        <ModalHeader>
          <CloseModalXButton />
          <ModalTitle>
            <FormattedMessage
              {...messages.title}
              values={{ nodeId: this.props.match.params.nodeId }}
            />
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <ListView>
            {this.props.drives
              .toJS()
              .map(drive => <NodeDrive key={drive.name} drive={drive} />)}
          </ListView>
        </ModalBody>
        <ModalFooter>
          <CloseModalButton>
            <FormattedMessage {...messages.close} />
          </CloseModalButton>
        </ModalFooter>
      </RoutedModal>
    );
  }
}
NodeDrives.propTypes = {
  drives: ImmutablePropTypes.list.isRequired,
  fetchNodeIntrospectionData: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired
};

const mapStateToProps = (state, props) => ({
  drives: getNodeDrives(state, props.match.params.nodeId)
});
const mapDispatchToProps = (dispatch, props) => ({
  fetchNodeIntrospectionData: () =>
    dispatch(fetchNodeIntrospectionData(props.match.params.nodeId))
});

export default connect(mapStateToProps, mapDispatchToProps)(NodeDrives);
