// Cookie manipulation library
//
// Loosely based on https://github.com/jshttp/cookie

var decode = decodeURIComponent;
var encode = encodeURIComponent;
var pairSplitRegExp = /; */;

function parse(str) {
  var obj = {};
  var pairs = str.split(pairSplitRegExp);

  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i];
    var eq_idx = pair.indexOf('=');

    if (eq_idx < 0) {
      continue;
    }

    var key = pair.substr(0, eq_idx).trim();
    var val = pair.substr(++eq_idx, pair.length).trim();

    if ('"' == val[0]) {
      val = val.slice(1, -1);
    }

    if (undefined == obj[key]) {
      obj[key] = tryDecode(val, decode);
    }
  }

  return obj;
}

function serialize(name, val, options) {
  var value = encode(val);
  var str = `${name}=${value}; Path=/`;

  if (window.tripleOUiConfig.useSecureCookie) {
    str += '; Secure';
  }

  return str;
}

function tryDecode(str, decode) {
  try {
    return decode(str);
  } catch (e) {
    return str;
  }
}

class Cookie {

  get(key) {
    var cookie = parse(document.cookie);
    return cookie[key] || null;
  }

  set(key, value) {
    document.cookie = serialize(key, value);
  }

  remove(key) {
    document.cookie = `${key}=; Path=/`;
  }

  clear() {
    var cookie = parse(document.cookie);
    var newCookie = '';

    for (var key in cookie) {
      newCookie += `${key}=;`;
    }

    document.cookie = newCookie;

  }

}

export default new Cookie();
