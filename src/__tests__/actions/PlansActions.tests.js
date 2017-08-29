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

import when from 'when'

import * as utils from '../../js/services/utils'
import MistralApiService from '../../js/services/MistralApiService'
import mockHistory from '../mocks/history'
import { mockGetIntl } from './utils'
import PlansActions from '../../js/actions/PlansActions'
// hacky solution to be able to spy on named export function
import * as PlansActionsModule from '../../js/actions/PlansActions'
import SwiftApiService from '../../js/services/SwiftApiService'
import storage from '../mocks/storage'

window.localStorage = window.sessionStorage = storage

describe('PlansActions', () => {
  beforeEach(() => {
    spyOn(utils, 'getAuthTokenId').and.returnValue('mock-auth-token')
  })

  describe('updatePlan', () => {
    beforeEach(done => {
      spyOn(PlansActions, 'updatePlanPending')
      spyOn(PlansActions, 'updatePlanSuccess')
      spyOn(PlansActions, 'fetchPlans')
      spyOn(PlansActionsModule, 'uploadFilesToContainer').and.callFake(
        when.resolve
      )
      spyOn(MistralApiService, 'runWorkflow').and.callFake(() =>
        when.resolve({ state: 'SUCCESS' })
      )

      PlansActions.updatePlan('somecloud', {}, mockHistory)(
        () => {},
        () => {},
        mockGetIntl
      )

      setTimeout(() => {
        done()
      }, 1)
    })

    it('dispatches updatePlanPending', () => {
      expect(PlansActions.updatePlanPending).toHaveBeenCalledWith('somecloud')
    })
  })

  describe('createPlan', () => {
    beforeEach(done => {
      spyOn(PlansActions, 'createPlanPending')
      spyOn(PlansActions, 'createPlanSuccess')
      // Mock the service call.
      spyOn(PlansActionsModule, 'uploadFilesToContainer').and.callFake(
        when.resolve
      )
      spyOn(MistralApiService, 'runAction').and.callFake(when.resolve)
      spyOn(MistralApiService, 'runWorkflow').and.callFake(() =>
        when.resolve({ state: 'SUCCESS' })
      )
      // Call the action creator and the resulting action.
      // In this case, dispatch and getState are just empty placeHolders.
      PlansActions.createPlan('somecloud', {})(() => {}, () => {}, mockGetIntl)
      // Call done with a minimal timeout.
      setTimeout(() => {
        done()
      }, 1)
    })

    it('dispatches createPlanPending', () => {
      expect(PlansActions.createPlanPending).toHaveBeenCalled()
    })
  })

  describe('deletePlans', () => {
    beforeEach(done => {
      spyOn(PlansActions, 'deletePlanPending')
      spyOn(PlansActions, 'deletePlanSuccess')
      spyOn(PlansActions, 'fetchPlans')
      // Mock the service call.
      spyOn(MistralApiService, 'runAction').and.callFake(when.resolve)
      // Call the action creator and the resulting action.
      // In this case, dispatch and getState are just empty placeHolders.
      PlansActions.deletePlan('somecloud', mockHistory)(
        () => {},
        () => {},
        mockGetIntl
      )
      // Call done with a minimal timeout.
      setTimeout(() => {
        done()
      }, 1)
    })

    it('dispatches deletePlanPending', () => {
      expect(PlansActions.deletePlanPending).toHaveBeenCalledWith('somecloud')
    })

    it('dispatches deletePlanSuccess', () => {
      expect(PlansActions.deletePlanSuccess).toHaveBeenCalledWith('somecloud')
    })

    it('dispatches fetchPlans', () => {
      expect(PlansActions.fetchPlans).not.toHaveBeenCalled()
    })
  })

  let apiResponseMistral = ['overcloud', 'another-cloud']

  let apiResponseSwift = [
    { responseText: `description: Default deployment plan\nname: overcloud` },
    { responseText: `description: My custom plan\nname: another-cloud` }
  ]

  describe('fetchPlans', () => {
    beforeEach(done => {
      let swiftAlreadyCalled = false
      spyOn(PlansActions, 'requestPlans')
      spyOn(PlansActions, 'receivePlans')
      spyOn(MistralApiService, 'runAction').and.callFake(() =>
        when.resolve(apiResponseMistral)
      )
      spyOn(SwiftApiService, 'getObject').and.callFake(() => {
        if (swiftAlreadyCalled) {
          return apiResponseSwift[1]
        } else {
          swiftAlreadyCalled = true
          return apiResponseSwift[0]
        }
      })

      // Mock the service call.
      // Call the action creator and the resulting action.
      // In this case, dispatch and getState are just empty placeHolders.
      PlansActions.fetchPlans()(() => {}, () => {})
      // Call done with a minimal timeout.
      setTimeout(() => {
        done()
      }, 1)
    })

    it('dispatches requestPlans', () => {
      expect(PlansActions.requestPlans).toHaveBeenCalled()
    })

    it('dispatches receivePlans', () => {
      expect(PlansActions.receivePlans).toHaveBeenCalledWith([
        {
          name: 'overcloud',
          title: undefined,
          description: undefined
        },
        {
          name: 'another-cloud',
          title: undefined,
          description: undefined
        }
      ])
    })
  })

  describe('fetchPlan', () => {
    let apiResponse = [
      { name: 'overcloud.yaml' },
      { name: 'capabilities_map.yaml' }
    ]

    beforeEach(done => {
      spyOn(SwiftApiService, 'getContainer').and.callFake(() =>
        when.resolve(apiResponse)
      )
      spyOn(PlansActions, 'requestPlan')
      spyOn(PlansActions, 'receivePlan')
      PlansActions.fetchPlan('overcloud')(() => {}, () => {})
      setTimeout(() => {
        done()
      }, 1)
    })

    it('dispatches requestPlan', () => {
      expect(PlansActions.requestPlan).toHaveBeenCalled()
    })

    it('dispatches receivePlan', () => {
      expect(PlansActions.receivePlan).toHaveBeenCalledWith('overcloud', {
        'overcloud.yaml': { name: 'overcloud.yaml' },
        'capabilities_map.yaml': { name: 'capabilities_map.yaml' }
      })
    })
  })
})
