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

/*eslint-disable quotes, quote-props, max-len */

export default {
  capabilities: {
    'root_template': 'overcloud-without-mergepy.yaml',
    'topics': [
      {
        'title': 'Basic Configuration',
        'description': null,
        'environment_groups': [
          {
            'title': null,
            'description': 'Enable basic configuration required for OpenStack Deployment',
            'environments': {
              'overcloud-resource-registry-puppet.yaml': {
                'file': 'overcloud-resource-registry-puppet.yaml',
                'title': 'Default Configuration',
                'description': null,
                'enabled': true
              }
            }
          },
          {
            'title': 'BigSwitch extensions or Cisco N1KV backend',
            'description': null,
            'environments': {
              'environments/neutron-ml2-bigswitch.yaml': {
                'file': 'environments/neutron-ml2-bigswitch.yaml',
                'title': 'BigSwitch extensions',
                'description': 'Enable Big Switch extensions, configured via puppet\n'
              },
              'environments/neutron-ml2-cisco-n1kv.yaml': {
                'file': 'environments/neutron-ml2-cisco-n1kv.yaml',
                'title': 'Cisco N1KV backend',
                'description': 'Enable a Cisco N1KV backend, configured via puppet\n'
              }
            }
          }
        ]
      }
    ]
  }
};
