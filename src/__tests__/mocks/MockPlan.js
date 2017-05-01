/*eslint-disable quotes, quote-props, max-len */

export default {
  capabilities: {
    root_template: 'overcloud-without-mergepy.yaml',
    topics: [
      {
        title: 'Basic Configuration',
        description: null,
        environment_groups: [
          {
            title: null,
            description: 'Enable basic configuration required for OpenStack Deployment',
            environments: {
              'overcloud-resource-registry-puppet.yaml': {
                file: 'overcloud-resource-registry-puppet.yaml',
                title: 'Default Configuration',
                description: null,
                enabled: true
              }
            }
          },
          {
            title: 'BigSwitch extensions or Cisco N1KV backend',
            description: null,
            environments: {
              'environments/neutron-ml2-bigswitch.yaml': {
                file: 'environments/neutron-ml2-bigswitch.yaml',
                title: 'BigSwitch extensions',
                description: 'Enable Big Switch extensions, configured via puppet\n'
              },
              'environments/neutron-ml2-cisco-n1kv.yaml': {
                file: 'environments/neutron-ml2-cisco-n1kv.yaml',
                title: 'Cisco N1KV backend',
                description: 'Enable a Cisco N1KV backend, configured via puppet\n'
              }
            }
          }
        ]
      }
    ]
  }
};
