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

export default {
  validations: [
    {
      description: 'Validations that run after the hardware was introspected.',
      name: 'Hardware Introspection',
      ref: '/v1/plans/undefined/validation_types/1/',
      stage: 'introspection',
      status: 'running',
      uuid: '1',
      validations: [
        {
          name: 'Basic connectivity',
          description: 'Check basic connectivity to the nodes',
          ref: '/v1/plans/undefined/validations/1/',
          uuid: '1',
          status: 'success'
        },
        {
          name: 'Install a package',
          description: 'Install necessary packages on the nodes',
          ref: '/v1/plans/undefined/validations/2/',
          uuid: '2',
          status: 'running'
        },
        {
          name: 'Verify installation',
          ref: '/v1/plans/undefined/validations/3/',
          uuid: '3',
          status: 'new'
        },
        {
          name: 'Do something really tricky',
          description:
            'This is a very tricky process that could take a long time to complete',
          ref: '/v1/plans/undefined/validations/4/',
          uuid: '4',
          status: 'failed'
        }
      ]
    },
    {
      description:
        'Validations verify that the network was configured properly on all nodes',
      name: 'Network Configuration',
      ref: '/v1/plans/undefined/validation_types/2/',
      stage: 'introspection',
      status: 'new',
      uuid: '2',
      validations: [
        {
          name: 'Running a custom module',
          ref: '/v1/plans/undefined/validations/3/',
          uuid: '3',
          status: 'new'
        }
      ]
    },
    {
      description: 'Validate nodes that have been registered.',
      name: 'Node Validations',
      ref: '/v1/plans/undefined/validation_types/1/',
      stage: 'introspection',
      status: 'running',
      uuid: '1',
      validations: [
        {
          name: 'Node Connectivity',
          description: 'Check basic connectivity',
          ref: '/v1/plans/undefined/validations/1/',
          uuid: '1',
          status: 'success'
        },
        {
          name: 'Node Availability',
          description: 'Check the nodes current availability',
          ref: '/v1/plans/undefined/validations/1/',
          uuid: '1',
          status: 'success'
        },
        {
          name: 'Node OS Version',
          description: 'Check operating system type and version',
          ref: '/v1/plans/undefined/validations/1/',
          uuid: '1',
          status: 'success'
        },
        {
          name: 'Node Storage Requirements',
          description: 'Check available disk memory',
          ref: '/v1/plans/undefined/validations/1/',
          uuid: '1',
          status: 'failed'
        },
        {
          name: 'Node RAM Requirements',
          description: 'Check the nodes RAM',
          ref: '/v1/plans/undefined/validations/1/',
          uuid: '1',
          status: 'new'
        },
        {
          name: 'Check CPUs',
          description: 'Check the CPU count',
          ref: '/v1/plans/undefined/validations/1/',
          uuid: '1',
          status: 'running'
        }
      ]
    },
    {
      description: 'Validations that run after the hardware was introspected.',
      name: 'Some Other Introspection',
      ref: '/v1/plans/undefined/validation_types/1/',
      stage: 'introspection',
      status: 'running',
      uuid: '1',
      validations: [
        {
          name: 'Basic connectivity',
          description: 'Check basic connectivity to the nodes',
          ref: '/v1/plans/undefined/validations/1/',
          uuid: '1',
          status: 'success'
        },
        {
          name: 'Install a package',
          description: 'Install necessary packages on the nodes',
          ref: '/v1/plans/undefined/validations/2/',
          uuid: '2',
          status: 'success'
        },
        {
          name: 'Verify installation',
          ref: '/v1/plans/undefined/validations/3/',
          uuid: '3',
          status: 'success'
        },
        {
          name: 'Do something really tricky',
          description:
            'This is a very tricky process that could take a long time to complete',
          ref: '/v1/plans/undefined/validations/4/',
          uuid: '4',
          status: 'failed'
        }
      ]
    },
    {
      description: 'Validations that run after the hardware was introspected.',
      name: 'Hardware Validations',
      ref: '/v1/plans/undefined/validation_types/1/',
      stage: 'introspection',
      status: 'running',
      uuid: '1',
      validations: [
        {
          name: 'Basic connectivity',
          description: 'Check basic connectivity to the nodes',
          ref: '/v1/plans/undefined/validations/1/',
          uuid: '1',
          status: 'running'
        },
        {
          name: 'Install a package',
          description: 'Install necessary packages on the nodes',
          ref: '/v1/plans/undefined/validations/2/',
          uuid: '2',
          status: 'running'
        },
        {
          name: 'Verify installation',
          ref: '/v1/plans/undefined/validations/3/',
          uuid: '3',
          status: 'new'
        }
      ]
    },
    {
      description: 'Validations that run after the hardware was introspected.',
      name: 'Storage Validations',
      ref: '/v1/plans/undefined/validation_types/1/',
      stage: 'introspection',
      status: 'running',
      uuid: '1',
      validations: [
        {
          name: 'Basic connectivity',
          description: 'Check basic connectivity to the nodes',
          ref: '/v1/plans/undefined/validations/1/',
          uuid: '1',
          status: 'success'
        },
        {
          name: 'Install a package',
          description: 'Install necessary packages on the nodes',
          ref: '/v1/plans/undefined/validations/2/',
          uuid: '2',
          status: 'success'
        }
      ]
    }
  ]
};
