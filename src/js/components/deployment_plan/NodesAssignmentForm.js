import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import { Form, reduxForm, submit } from 'redux-form';
import React from 'react';

import { getAssignedNodesCountsByRole } from '../../selectors/nodesAssignment';
import { getCurrentPlan } from '../../selectors/plans';
import ParametersActions from '../../actions/ParametersActions';
import FormErrorList from '../ui/forms/FormErrorList';

class NodesAssignmentForm extends React.Component {
  constructor(props) {
    super(props);
    this.debouncedUpdate = debounce(this.update.bind(this), 1000);
  }

  componentWillReceiveProps(nextProps) {
    // TODO(jtomasek): update this to happen as onChange when this is released https://github.com/erikras/redux-form/pull/2576
    // and combine it with calling to this.props.submit() rather than calling nextProps.handleSubmit(....)
    // make sure debouncing works properly
    if (nextProps.dirty && nextProps.valid && !nextProps.submitting) {
      // nextProps.submit();
      nextProps.handleSubmit(this.debouncedUpdate.bind(this))();
    } else if (nextProps.invalid || nextProps.submitting) {
      this.debouncedUpdate.cancel();
    }
  }

  update(data) {
    this.props.updateParameters(this.props.currentPlan.name, data);
  }

  render() {
    const { error, handleSubmit, children } = this.props;
    return (
      <Form onSubmit={handleSubmit(this.debouncedUpdate.bind(this))}>
        <FormErrorList errors={error ? [error] : []}/>
        {children}
      </Form>
    );
  }
}
NodesAssignmentForm.propTypes = {
  children: React.PropTypes.node,
  currentPlan: ImmutablePropTypes.record.isRequired,
  error: React.PropTypes.object,
  handleSubmit: React.PropTypes.func.isRequired,
  pristine: React.PropTypes.bool.isRequired,
  updateParameters: React.PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  currentPlan: getCurrentPlan(state),
  initialValues: getAssignedNodesCountsByRole(state).toJS()
});

const mapDispatchToProps = (dispatch) => {
  return {
    updateParameters: (currentPlanName, data, inputFields, redirectPath) => {
      dispatch(ParametersActions.updateParameters(
        currentPlanName, data, inputFields, redirectPath));
    },
    submit: () => dispatch(submit('nodesAssignment'))
  };
};

const form = reduxForm({
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  form: 'nodesAssignment'
});

export default connect(mapStateToProps, mapDispatchToProps)(form(NodesAssignmentForm));
