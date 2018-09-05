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

import { generateDownloadUrl } from '../../js/actions/utils';

describe('generateDownloadUrl', () => {
  it('correctly combines swiftUrl and tempurl', () => {
    const tempurl =
      'https://192.168.24.2:13808/v1/AUTH_b37a1bf96c6645618bd0067556f95079/plan-exports/overcloud.tar.gz?temp_url_sig=bf9ee05155229d7340e6781e07058404bbc8ef4e&temp_url_expires=1536141784';
    const swiftUrl =
      'https://192.168.24.2:443/swift/v1/AUTH_b37a1bf96c6645618bd0067556f95079';
    const expectedDownloadUrl =
      'https://192.168.24.2:443/swift/v1/AUTH_b37a1bf96c6645618bd0067556f95079/plan-exports/overcloud.tar.gz?temp_url_sig=bf9ee05155229d7340e6781e07058404bbc8ef4e&temp_url_expires=1536141784';
    expect(generateDownloadUrl(tempurl, swiftUrl)).toEqual(expectedDownloadUrl);
  });
});
