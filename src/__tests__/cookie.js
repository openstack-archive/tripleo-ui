import cookie from '../js/cookie';

describe('cookie', () => {
  it('should parse a cookie correctly', () => {
    expect(cookie._parse('key=value')).toEqual({
      key: 'value'
    });
  });

  it('should serialize a cookie correctly', () => {
    expect(cookie._serialize('key', 'value')).toEqual(
      'key=value; Path=/'
    );
  });
});
