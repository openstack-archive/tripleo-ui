import ClassNames from 'classnames';
import { Field } from 'redux-form';
import React from 'react';
import PropTypes from 'prop-types';

/* ListView example usage:

<ListView>
  <ListViewItem stacked expanded>

    <ListViewItemHeader> // required only if the ListViewItem is supposed to be expandable
      <ListViewExpand toggleExpanded={functionToToggle} expanded />
      <ListViewCheckbox disabled={inProgress} name={`values.${node.uuid}`} />
      <ListViewMainInfo>
        <ListViewLeft>
          <ListViewIcon size="sm" icon={iconClass} />
        </ListViewLeft>
        <ListViewBody>
          <ListViewDescription>
            <ListViewDescriptionHeading>
              {name}
            </ListViewDescriptionHeading>
            <ListViewDescriptionText>
              {description}
            </ListViewDescriptionText>
          </ListViewDescription>
          <ListViewAdditionalInfo>
            <ListViewAdditionalInfoItem>
              <span className="pficon pficon-flavor" />
              {Item1}
            </ListViewAdditionalInfoItem>
            <ListViewAdditionalInfoItem>
              <span className="pficon pficon-cpu" />
              {Item2}
            </ListViewAdditionalInfoItem>
          </ListViewAdditionalInfo>
        </ListViewBody>
      </ListViewMainInfo>
    </ListViewItemHeader>

    <ListViewItemContainer onClose={functionWhichClosesMe} expanded> // expandable content
      <Row>Some content goes here</Row>
    </ListViewItemContainer>

  </ListViewItem>
  ...
</ListView>
*/

export const ListView = ({ children }) => (
  <div className="list-group list-view-pf list-view-pf-view">
    {children}
  </div>
);
ListView.propTypes = {
  children: PropTypes.node
};

export const ListViewItem = ({ children, stacked, expanded }) => {
  const classes = ClassNames({
    'list-group-item': true,
    'list-view-pf-expand-active': expanded,
    'list-view-pf-stacked': stacked
  });
  return (
    <div className={classes}>
      {children}
    </div>
  );
};
ListViewItem.propTypes = {
  children: PropTypes.node,
  expanded: PropTypes.bool.isRequired,
  stacked: PropTypes.bool.isRequired
};
ListViewItem.defaultProps = {
  expanded: false,
  stacked: false
};

export const ListViewItemHeader = ({ children }) => (
  <div className="list-group-item-header">
    {children}
  </div>
);
ListViewItemHeader.propTypes = {
  children: PropTypes.node
};

export const ListViewItemContainer = ({ children, expanded, onClose }) => {
  const classes = ClassNames({
    'list-group-item-container container-fluid': true,
    hidden: !expanded
  });
  return (
    <div className={classes}>
      {onClose &&
        <div className="close">
          <span className="pficon pficon-close" onClick={() => onClose()} />
        </div>}
      {expanded && children}
    </div>
  );
};
ListViewItemContainer.propTypes = {
  children: PropTypes.node,
  expanded: PropTypes.bool.isRequired,
  onClose: PropTypes.func
};
ListViewItemContainer.defaultProps = {
  expanded: false
};

export const ListViewCheckbox = ({ disabled, name }) => (
  <div className="list-view-pf-checkbox">
    <Field name={name} type="checkbox" component="input" disabled={disabled} />
  </div>
);
ListViewCheckbox.propTypes = {
  disabled: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired
};
ListViewCheckbox.defaultProps = {
  disabled: false
};

export const ListViewExpand = ({ expanded, toggleExpanded }) => {
  const classes = ClassNames({
    'fa fa-angle-right': true,
    'fa-angle-down': expanded
  });
  return (
    <a className="list-view-pf-expand" onClick={() => toggleExpanded()}>
      <span className={classes} />
    </a>
  );
};
ListViewExpand.propTypes = {
  expanded: PropTypes.bool.isRequired,
  toggleExpanded: PropTypes.func.isRequired
};
ListViewExpand.defaultProps = {
  expanded: false
};

export const ListViewActions = ({ children }) => (
  <div className="list-view-pf-actions">
    {children}
  </div>
);
ListViewActions.propTypes = {
  children: PropTypes.node
};

export const ListViewMainInfo = ({ children }) => (
  <div className="list-view-pf-main-info">
    {children}
  </div>
);
ListViewMainInfo.propTypes = {
  children: PropTypes.node
};

export const ListViewLeft = ({ children }) => (
  <div className="list-view-pf-left">
    {children}
  </div>
);
ListViewLeft.propTypes = {
  children: PropTypes.node
};

export const ListViewIcon = ({ icon, size }) => {
  return <span className={`list-view-pf-icon-${size} ${icon}`} />;
};
ListViewIcon.propTypes = {
  icon: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg'])
};

export const ListViewBody = ({ children }) => (
  <div className="list-view-pf-body">
    {children}
  </div>
);
ListViewBody.propTypes = {
  children: PropTypes.node
};

export const ListViewDescription = ({ children }) => (
  <div className="list-view-pf-description">
    {children}
  </div>
);
ListViewDescription.propTypes = {
  children: PropTypes.node
};

export const ListViewDescriptionHeading = ({ children }) => (
  <div className="list-group-item-heading">
    {children}
  </div>
);
ListViewDescriptionHeading.propTypes = {
  children: PropTypes.node
};

export const ListViewDescriptionText = ({ children }) => (
  <div className="list-group-item-text">
    {children}
  </div>
);
ListViewDescriptionText.propTypes = {
  children: PropTypes.node
};

export const ListViewAdditionalInfo = ({ children }) => (
  <div className="list-view-pf-additional-info">
    {children}
  </div>
);
ListViewAdditionalInfo.propTypes = {
  children: PropTypes.node
};

export const ListViewAdditionalInfoItem = ({ children }) => (
  <div className="list-view-pf-additional-info-item">
    {children}
  </div>
);
ListViewAdditionalInfoItem.propTypes = {
  children: PropTypes.node
};
