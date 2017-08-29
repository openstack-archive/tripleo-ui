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
import { Link, Route } from 'react-router-dom'

const NavTab = ({ activeClassName, children, to, exact, location, id }) => {
  return (
    <Route
      location={location}
      path={typeof to === 'object' ? to.pathname : to}
      exact={exact}
      children={({ match, location }) => (
        <li className={match ? activeClassName : ''} id={id}>
          <Link to={to}>{children}</Link>
        </li>
      )}
    />
  )
}
NavTab.propTypes = {
  activeClassName: PropTypes.string.isRequired,
  children: PropTypes.node,
  exact: PropTypes.bool.isRequired,
  id: PropTypes.string,
  location: PropTypes.object,
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired
}
NavTab.defaultProps = {
  activeClassName: 'active',
  exact: false
}

export default NavTab
