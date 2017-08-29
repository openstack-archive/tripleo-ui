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

export function Timer(callback, delay) {
  var timerId
  var start
  var remaining = delay

  this.pause = function() {
    clearTimeout(timerId)
    remaining -= new Date() - start
  }

  this.resume = function() {
    start = new Date()
    clearTimeout(timerId)
    timerId = setTimeout(callback, remaining)
  }

  this.clear = function() {
    clearTimeout(timerId)
  }

  this.resume()
}

/**
 * Utility function to format value in Bytes to human readable format
 */
export const formatBytes = (bytes, decimals) => {
  if (bytes == 0) return '0 Bytes'
  var k = 1000,
    dm = decimals || 2,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k))
  return [parseFloat((bytes / Math.pow(k, i)).toFixed(dm)), sizes[i]]
}
