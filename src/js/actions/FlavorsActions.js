/**
 * Copyright 2018 Red Hat Inc.
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

import { normalize } from 'normalizr';

import { flavorSchema } from '../normalizrSchemas/flavors';
import { handleErrors } from './ErrorActions';
import NovaApiService from '../services/NovaApiService';
import FlavorsConstants from '../constants/FlavorsConstants';

export default {
  fetchFlavorsPending() {
    return {
      type: FlavorsConstants.FETCH_FLAVORS_PENDING
    };
  },

  fetchFlavorsSuccess(flavors) {
    return {
      type: FlavorsConstants.FETCH_FLAVORS_SUCCESS,
      payload: flavors
    };
  },

  fetchFlavorsFailed() {
    return {
      type: FlavorsConstants.FETCH_FLAVORS_FAILED
    };
  },

  // Fetch Nova flavors including os-extra_specs
  // Unfortunately, we have to make a separate API call for each flavor.
  fetchFlavors() {
    return dispatch => {
      dispatch(this.fetchFlavorsPending());
      return dispatch(NovaApiService.getFlavors())
        .then(response => {
          const flavors = normalize(response.flavors, [flavorSchema]).entities
            .flavors;
          return Promise.all(
            Object.keys(flavors).map(flavorId =>
              dispatch(NovaApiService.getFlavorProfile(flavorId))
            )
          ).then(flavorProfiles => {
            flavorProfiles.map(profile => {
              flavors[profile.id].extra_specs = profile.extra_specs;
            });
            dispatch(this.fetchFlavorsSuccess(flavors));
          });
        })
        .catch(error => {
          dispatch(handleErrors(error, 'Flavors could not be loaded.'));
          dispatch(this.fetchFlavorsFailed());
        });
    };
  }
};
