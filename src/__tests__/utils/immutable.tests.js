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

import { List } from 'immutable';
import { splitListIntoChunks } from '../../js/utils/immutablejs';

describe('splitListIntoChunks function', () => {
  // TODO: This test passes but the function's behavior doesn't make sense
  // The result should just be an empty list.
  it('works on empty lists', () => {
    const list = List();
    expect(splitListIntoChunks(list, 3)).toEqual(
      List([List(), List(), List()])
    );
  });

  it('works when list length and chunk length is the same', () => {
    const list = List([1, 2, 3]);
    expect(splitListIntoChunks(list, 3)).toEqual(
      List([List([1]), List([2]), List([3])])
    );
  });

  it('works when list length is a multiple of chunk size ', () => {
    const list = List([1, 2, 3, 4]);
    expect(splitListIntoChunks(list, 2)).toEqual(
      List([List([1, 2]), List([3, 4])])
    );
  });

  // TODO: This test passes but the function's behavior doesn't make sense
  it('works when the result are uneven chunks', () => {
    const list = List([1, 2, 3, 4]);
    expect(splitListIntoChunks(list, 3)).toEqual(
      List([List([1, 2]), List([3, 4]), List()])
    );

    expect(splitListIntoChunks(List([1, 2, 3, 4, 5, 6, 7]), 3)).toEqual(
      List([List([1, 2, 3]), List([4, 5, 6]), List([7])])
    );
  });
});
