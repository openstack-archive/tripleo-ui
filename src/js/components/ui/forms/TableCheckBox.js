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

import Formsy from 'formsy-react'
import PropTypes from 'prop-types'
import React from 'react'

class TableCheckBox extends React.Component {
  changeValue(event) {
    this.props.setValue(event.target.checked)
  }

  render() {
    return (
      <input
        type={this.props.type}
        name={this.props.name}
        ref={this.props.id}
        id={this.props.id}
        disabled={this.props.disabled}
        onChange={this.changeValue.bind(this)}
        checked={!!this.props.getValue()}
        value={this.props.getValue()}
      />
    )
  }
}
TableCheckBox.propTypes = {
  disabled: PropTypes.bool.isRequired,
  getValue: PropTypes.func,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  setValue: PropTypes.func,
  type: PropTypes.string
}
TableCheckBox.defaultProps = {
  disabled: false,
  type: 'checkbox'
}
export default Formsy.HOC(TableCheckBox)
