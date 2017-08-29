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

import { IntlProvider } from 'react-intl'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'

const IronicApiService = require('../../../js/services/IronicApiService')

// TODO(jtomasek): remove this import when store is correctly mocked
import store from '../../../js/store' // eslint-disable-line no-unused-vars
import Nodes from '../../../js/components/nodes/Nodes'

describe('Nodes Component', () => {
  let NodesVdom, NodesInstance
  beforeEach(() => {
    let shallowRenderer = new ReactShallowRenderer()
    const intlProvider = new IntlProvider({ locale: 'en' }, {})
    const { intl } = intlProvider.getChildContext()
    shallowRenderer.render(<Nodes.WrappedComponent intl={intl} />)
    NodesVdom = shallowRenderer.getRenderOutput()
    NodesInstance = shallowRenderer._instance._instance
  })

  // TODO(jtomasek): not sure how to mock children passed by react router
  xit('should render Nodes nav tabs', () => {
    expect(NodesVdom).toExist()
  })

  xit('should render tab-pane', () => {})

  xit('should listen to NodesStore changes', () => {})

  xit(
    'should get nodes from NodesStore and store them in state on change in NodesStore',
    () => {}
  )

  xit('should issue a request to list Nodes on when mounted', () => {
    spyOn(IronicApiService, 'handleGetNodes')
    NodesInstance.componentDidMount()
    expect(IronicApiService.handleGetNodes).toHaveBeenCalled()
  })
})
