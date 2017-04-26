import { Button, FormGroup, MenuItem } from 'react-bootstrap';
import { defineMessages, FormattedMessage } from 'react-intl';
import React, { PropTypes } from 'react';

import DropdownKebab from '../../ui/dropdown/DropdownKebab';

const messages = defineMessages({
  introspectNodes: {
    id: 'NodesToolbarActions.introspectNodes',
    defaultMessage: 'Introspect Nodes'
  },
  tagNodes: {
    id: 'NodesToolbarActions.tagNodes',
    defaultMessage: 'Tag Nodes'
  },
  provideNodes: {
    id: 'NodesToolbarActions.provideNodes',
    defaultMessage: 'Provide Nodes',
    description: '"Providing" the nodes changes the provisioning state to "available" so that '
                 + 'they can be used in a deployment.'
  },
  removeNodes: {
    id: 'NodesToolbarActions.removeNodes',
    defaultMessage: 'Remove Nodes'
  }
});

export default class NodesToolbarActions extends React.Component {
  render() {
    return (
      <FormGroup>
        <Button><FormattedMessage {...messages.introspectNodes} /></Button>
        <Button><FormattedMessage {...messages.provideNodes} /></Button>
        <DropdownKebab id="nodesActionsKebab">
          <MenuItem><FormattedMessage {...messages.tagNodes} /></MenuItem>
          <MenuItem><FormattedMessage {...messages.removeNodes} /></MenuItem>
        </DropdownKebab>
      </FormGroup>
    );
  }
}
NodesToolbarActions.propTypes = {
};
