import { getIn, setIn } from '../src/utils';

describe('getIn', () => {
  test('flat', () => {
    expect(getIn({ name: 'fastform', mynum: 11 }, 'name')).toEqual('fastform');
  });

  test('nested object', () => {
    expect(getIn({ name: { first: 'fast', last: 'form' }}, 'name.first')).toEqual('fast');
  });

  test('nested array', () => {
    expect(getIn({ name: ['fast', 'form']}, 'name[1]')).toEqual('form');
  });
});

describe('setIn', () => {
  test('setting on object', () => {
    const obj = {};
    const res = setIn(obj, 'name', 'fastform');
    expect(res).toEqual({ name: 'fastform' });
  });

  test('nested obj', () => {
    const obj = {};
    expect(setIn(obj, 'name.first', 'fast')).toEqual({ name: { first: 'fast' } });
  });

  test('nested array', () => {
    const obj = {};
    expect(setIn(obj, 'name[0]', 'fast')).toEqual({ name: ['fast'] });
  })
});