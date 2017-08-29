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
import { Map } from 'immutable'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'

import store from '../../../js/store'
import PlansList from '../../../js/components/plan/PlansList'
import FileList from '../../../js/components/plan/FileList'
import { PlanFile } from '../../../js/immutableRecords/plans'

describe('PlansList component', () => {
  let output

  beforeEach(() => {
    let shallowRenderer = new ReactShallowRenderer()
    const intlProvider = new IntlProvider({ locale: 'en' }, {})
    const { intl } = intlProvider.getChildContext()
    shallowRenderer.render(
      <PlansList.WrappedComponent store={store} intl={intl} />
    )
    output = shallowRenderer.getRenderOutput()
  })

  it('renders a table of plan names', () => {
    expect(output.type.name).toEqual('PlansList')
  })
})

let getTableRows = (planFiles, selectedFiles) => {
  let result
  let shallowRenderer = new ReactShallowRenderer()
  shallowRenderer.render(
    <FileList planFiles={planFiles} selectedFiles={selectedFiles} />
  )
  result = shallowRenderer.getRenderOutput()
  return result.props.children[1].props.children.props.children
}

describe('FileList component', () => {
  it('renders a list of plan files, ordered alphabetically', () => {
    let tableRows = getTableRows(
      Map({
        'foo.yaml': new PlanFile({ name: 'foo.yaml' }),
        'bar.yaml': new PlanFile({ name: 'bar.yaml' })
      }),
      []
    )
    expect(tableRows[0].key).toBe('bar.yaml')
    expect(tableRows[1].key).toBe('foo.yaml')
  })

  it('renders a list of selected files, ordered alphabetically', () => {
    let tableRows = getTableRows(Map(), [
      { name: 'foo.yaml', content: 'foo' },
      { name: 'bar.yaml', content: 'bar' }
    ])
    expect(tableRows[0].key).toBe('bar.yaml')
    expect(tableRows[1].key).toBe('foo.yaml')
  })

  it('merges a list of selected files and planfiles', () => {
    let tableRows = getTableRows(
      Map({
        'foobar.yaml': new PlanFile({ name: 'foobar.yaml' }),
        'foo.yaml': new PlanFile({ name: 'foo.yaml' }),
        'bar.yaml': new PlanFile({ name: 'bar.yaml' })
      }),
      [
        { name: 'foo.yaml', content: 'foo' },
        { name: 'bar.yaml', content: 'bar' }
      ]
    )
    expect(tableRows[0].key).toBe('bar.yaml')
    expect(tableRows[1].key).toBe('foo.yaml')
    expect(tableRows[2].key).toBe('foobar.yaml')
  })

  it('adds classes and sorts files based on differences in selected files and planfiles', () => {
    let tableRows = getTableRows(
      Map({
        'foo.yaml': new PlanFile({ name: 'foo.yaml' }),
        'bar.yaml': new PlanFile({ name: 'bar.yaml' })
      }),
      [
        { name: 'foo.yaml', content: 'foo' },
        { name: 'bar.yaml', content: 'changed' },
        { name: 'foobar.yaml', content: 'foobar' }
      ]
    )
    expect(tableRows[0].key).toBe('foobar.yaml')
    expect(tableRows[0].props.children.props.className).toBe('new-plan-file')
    expect(tableRows[1].key).toBe('bar.yaml')
    expect(tableRows[1].props.children.props.className).toBe('')
    expect(tableRows[2].key).toBe('foo.yaml')
    expect(tableRows[2].props.children.props.className).toBe('')
  })
})
