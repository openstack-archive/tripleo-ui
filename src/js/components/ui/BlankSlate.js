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

import PropTypes from 'prop-types'
import React from 'react'

export default class BlankSlate extends React.Component {
  render() {
    return (
      <div className="blank-slate-pf">
        <div className="blank-slate-pf-icon">
          <span className={this.props.iconClass} />
        </div>
        <h1>{this.props.title}</h1>
        {this.props.children}
      </div>
    )
  }
}

BlankSlate.propTypes = {
  children: PropTypes.node,
  iconClass: PropTypes.string,
  title: PropTypes.string
}
BlankSlate.defaultProps = {
  iconClass: 'fa fa-ban',
  title: ''
}
