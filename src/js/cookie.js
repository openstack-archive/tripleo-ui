// Cookie manipulation library
//
// Loosely based on https://github.com/jshttp/cookie

var pairSplitRegExp = /; */;

class Cookie {

  _parse(str) {
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
        obj[key] = this._tryDecode(val, decodeURIComponent);
      }
    }

    return obj;
  }

  _serialize(name, val, options) {
    var value = encodeURIComponent(val);
    var str = `${name}=${value}; Path=/`;

    if (window.tripleOUiConfig && window.tripleOUiConfig.useSecureCookie) {
      str += '; Secure';
    }

    return str;
  }

  _tryDecode(str, decode) {
    try {
      return decode(str);
    } catch (e) {
      return str;
    }
  }


  get(key) {
    var cookie = this._parse(document.cookie);
    return cookie[key] || null;
  }

  set(key, value) {
    document.cookie = this._serialize(key, value);
  }

  remove(key) {
    document.cookie = `${key}=; Path=/`;
  }

  clear() {
    var cookie = this._parse(document.cookie);
    var newCookie = '';

    for (var key in cookie) {
      newCookie += `${key}=;`;
    }

    document.cookie = newCookie;

  }

}

export default new Cookie();
