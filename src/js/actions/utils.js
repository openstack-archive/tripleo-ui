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

/**
 * Generates plan download url by combining swiftUrl and tempurl
 * @param {string} tempurl
 * @param {string} swiftUrl
 */
export const generateDownloadUrl = (tempurl, swiftUrl) => {
  const urlParser = document.createElement('a');
  urlParser.href = tempurl;
  return `${swiftUrl}/${urlParser.pathname
    .split('/')
    .slice(3)
    .join('/')}${urlParser.search}`;
};
