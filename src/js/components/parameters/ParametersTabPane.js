import * as _ from 'lodash';
import React from 'react';

import HorizontalInput from '../ui/forms/HorizontalInput';
import HorizontalTextarea from '../ui/forms/HorizontalTextarea';
import HorizontalCheckBox from '../ui/forms/HorizontalCheckBox';
import HorizontalStaticText from '../ui/forms/HorizontalStaticText';
// import ParameterTabPaneGroupList from './ParameterTabPaneGroupList';

export default class ParametersTabPane extends React.Component {
  isTabActive() {
    return this.props.activeTab === this.props.name;
  }

  /**
  * Process the parameter, generate relevant input
  * As this method grows, extract it into separate ParameterProcessor service
  */
  _processParameter(parameter, index) {
    if(parameter.Value) {
      return (
        <HorizontalStaticText key={index}
                              text={parameter.Value}
                              title={parameter.Label}
                              labelColumnClasses="col-sm-4"
                              inputColumnClasses="col-sm-8"/>
      );
    } else if(parameter.Type.toLowerCase() === 'json') {
      return (
        <HorizontalTextarea key={index}
                            name={parameter.name}
                            title={parameter.Label}
                            description={parameter.Description}
                            value={JSON.stringify(parameter.Default)}
                            labelColumnClasses="col-sm-4"
                            inputColumnClasses="col-sm-8"/>
      );
    } else if(parameter.Type.toLowerCase() === 'String' &&
              /^.*(Key|Cert|Certificate)$/.test(parameter.name)) {
      return (
        <HorizontalTextarea key={index}
                            name={parameter.name}
                            title={parameter.Label}
                            description={parameter.Description}
                            value={parameter.Default}
                            labelColumnClasses="col-sm-4"
                            inputColumnClasses="col-sm-8"/>
      );
    } else if(parameter.Type.toLowerCase().toLowerCase() === 'number') {
      return (
        <HorizontalInput key={index}
                               name={parameter.name}
                               title={parameter.Label}
                               type="number"
                               min={0}
                               description={parameter.Description}
                               value={parameter.Default}
                               labelColumnClasses="col-sm-4"
                               inputColumnClasses="col-sm-8"/>
      );
    } else if(parameter.Type.toLowerCase() === 'boolean') {
      return (
        <HorizontalCheckBox key={index}
                            name={parameter.name}
                            id={parameter.name}
                            title={parameter.Label}
                            description={parameter.Description}
                            value={parameter.Default}
                            labelColumnClasses="col-sm-4"
                            inputColumnClasses="col-sm-8"/>
      );
    } else {
      return (
        <HorizontalInput key={index}
                         name={parameter.name}
                         title={parameter.Label}
                         description={parameter.Description}
                         value={parameter.Default}
                         labelColumnClasses="col-sm-4"
                         inputColumnClasses="col-sm-8"/>
      );
    }
  }

  render() {
    // convert Parameters object to array
    let parameters = _.values(_.mapKeys(this.props.parameters, (value, key) => {
      return value.name = key;
    })).map((parameter, index) => {
      return this._processParameter(parameter, index);
    });

    return (
      <div className="tab-content">
        <div className={`tab-pane${this.isTabActive() ? ' active' : ''}`}>
          <fieldset>
            {parameters}
          </fieldset>
        </div>
        {/*this.props.nestedParameters ? (
          <ParameterTabPaneGroupList nestedParameters={this.props.nestedParameters}
                                     activeTab={this.props.activeTab}/>
        ) : null*/}
      </div>
    );
  }
}
ParametersTabPane.propTypes = {
  activeTab: React.PropTypes.string,
  name: React.PropTypes.string,
  nestedParameters: React.PropTypes.object,
  parameters: React.PropTypes.object
};
