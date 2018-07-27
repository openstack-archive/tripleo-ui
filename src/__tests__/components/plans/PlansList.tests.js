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

import { IntlProvider } from 'react-intl';
import { Map, Set } from 'immutable';
import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';

import { mockStore } from '../../actions/utils';
import PlansList from '../../../js/components/plan/PlansList';
import FileList from '../../../js/components/plan/FileList';
import { InitialPlanState } from '../../../js/immutableRecords/plans';

describe('PlansList component', () => {
  let output;
  const store = mockStore({
    plans: new InitialPlanState({ currentPlanName: 'overcloud' }),
    deploymentStatus: {
      deploymentStatusByPlan: Map(),
      deploymentStatusUI: Map()
    }
  });

  beforeEach(() => {
    let shallowRenderer = new ReactShallowRenderer();
    const intlProvider = new IntlProvider({ locale: 'en' }, {});
    const { intl } = intlProvider.getChildContext();
    shallowRenderer.render(
      <PlansList.WrappedComponent store={store} intl={intl} />
    );
    output = shallowRenderer.getRenderOutput();
  });

  it('renders a table of plan names', () => {
    expect(output.type.name).toEqual('PlansList');
  });
});

let getTableRows = (planFiles, selectedFiles) => {
  let result;
  let shallowRenderer = new ReactShallowRenderer();
  shallowRenderer.render(
    <FileList planFiles={planFiles} selectedFiles={selectedFiles} />
  );
  result = shallowRenderer.getRenderOutput();
  return result.props.children[1].props.children.props.children;
};

describe('FileList component', () => {
  it('renders a list of plan files, ordered alphabetically', () => {
    let tableRows = getTableRows(Set(['foo.yaml', 'bar.yaml']), []);
    expect(tableRows[0].key).toBe('bar.yaml');
    expect(tableRows[1].key).toBe('foo.yaml');
  });

  it('renders a list of selected files, ordered alphabetically', () => {
    let tableRows = getTableRows(Set(), [
      { filePath: 'foo.yaml', contents: 'foo' },
      { filePath: 'bar.yaml', contents: 'bar' }
    ]);
    expect(tableRows[0].key).toBe('bar.yaml');
    expect(tableRows[1].key).toBe('foo.yaml');
  });

  it('merges a list of selected files and planfiles', () => {
    let tableRows = getTableRows(Set(['foobar.yaml', 'foo.yaml', 'bar.yaml']), [
      { filePath: 'foo.yaml', contents: 'foo' },
      { filePath: 'bar.yaml', contents: 'bar' }
    ]);
    expect(tableRows[0].key).toBe('bar.yaml');
    expect(tableRows[1].key).toBe('foo.yaml');
    expect(tableRows[2].key).toBe('foobar.yaml');
  });

  it('adds classes and sorts files based on differences in selected files and planfiles', () => {
    let tableRows = getTableRows(Set(['old.yaml', 'foo.yaml', 'bar.yaml']), [
      { filePath: 'foo.yaml', contents: 'foo' },
      { filePath: 'bar.yaml', contents: 'changed' },
      { filePath: 'foobar.yaml', contents: 'foobar' }
    ]);
    expect(tableRows[0].key).toBe('bar.yaml');
    expect(tableRows[0].props.children.props.className).toBe('new-plan-file');
    expect(tableRows[1].key).toBe('foo.yaml');
    expect(tableRows[1].props.children.props.className).toBe('new-plan-file');
    expect(tableRows[2].key).toBe('foobar.yaml');
    expect(tableRows[2].props.children.props.className).toBe('new-plan-file');
    expect(tableRows[3].key).toBe('old.yaml');
    expect(tableRows[3].props.children.props.className).toBe('');
  });
});
