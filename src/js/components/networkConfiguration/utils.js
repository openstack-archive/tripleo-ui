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

export const networksColorStyles = {
  Provisioning: { backgroundColor: '#00659c', borderColor: '#004368' },
  External: { backgroundColor: '#a30000', borderColor: '#8b0000' },
  InternalApi: { backgroundColor: '#ec7a08', borderColor: '#b35c00' },
  Storage: { backgroundColor: '#00b9e4', borderColor: '#008bad' },
  StorageMgmt: { backgroundColor: '#3f9c35', borderColor: '#2d7623' },
  Tenant: { backgroundColor: '#007a87', borderColor: '#005c66' },
  Management: { backgroundColor: '#8461f7', borderColor: '#703fec' },
  disabled: { backgroundColor: '#d1d1d1', borderColor: '#bbbbbb' },
  default: { backgroundColor: '#6ca100', borderColor: '#486b00' }
};

export const getNetworkColorStyle = networkName =>
  networksColorStyles[networkName] || networksColorStyles.default;
