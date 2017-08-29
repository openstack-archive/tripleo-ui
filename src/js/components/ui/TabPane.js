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

import ClassNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

export default class TabPane extends React.Component {
  renderChildren() {
    if (this.props.renderOnlyActive) {
      return this.props.isActive ? this.props.children : null
    }
    return this.props.children
  }

  render() {
    let classes = ClassNames({
      'tab-pane': true,
      active: this.props.isActive
    })

    return (
      <div className={classes}>
        {this.renderChildren()}
      </div>
    )
  }
}
TabPane.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  isActive: PropTypes.bool.isRequired,
  renderOnlyActive: PropTypes.bool.isRequired
}
TabPane.defaultProps = {
  renderOnlyActive: false
}
