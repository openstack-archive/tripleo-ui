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

import React from 'react'
import { Route, Switch } from 'react-router-dom'

import PlansList from './PlansList'
import DeletePlan from './DeletePlan'
import EditPlan from './EditPlan'
import ExportPlan from './ExportPlan'
import NewPlan from './NewPlan'

export default class Plans extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="col-sm-12">
          <Route path="/plans/manage" component={PlansList} />
          <Switch>
            <Route path="/plans/manage/new" component={NewPlan} />
            <Route
              path="/plans/manage/:planName/delete"
              component={DeletePlan}
            />
            <Route path="/plans/manage/:planName/edit" component={EditPlan} />
            <Route
              path="/plans/manage/:planName/export"
              component={ExportPlan}
            />
          </Switch>
        </div>
      </div>
    )
  }
}
