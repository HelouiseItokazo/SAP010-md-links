import {
  describe,
  expect,
  it,
} from '@jest/globals';

import {
  mdLinks
} from "../index.js";

describe('mdLinks', () => {

  it('deveria ser uma função', () => {
    expect(typeof mdLinks).toBe('function');
  });

  it('deveria ser uma retornar uma promise', () => {
    const result = mdLinks('target_dir');
    expect(result instanceof Promise).toBe(true);
  });

});
