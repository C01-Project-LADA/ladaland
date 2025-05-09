// Util function from https://github.com/vasturiano/globe.gl/blob/master/example/airline-routes/us-international-outbound.html

/* eslint-disable @typescript-eslint/no-unused-expressions */
/* esm.sh - d3-dsv@3.0.1 */
const y = {},
  A = {},
  x = 34,
  w = 10,
  E = 13;
function P(r) {
  return new Function(
    'd',
    'return {' +
      r
        .map(function (e, o) {
          return JSON.stringify(e) + ': d[' + o + '] || ""';
        })
        .join(',') +
      '}'
  );
}
function Z(r, e) {
  var o = P(r);
  return function (a, s) {
    return e(o(a), s, r);
  };
}
function D(r) {
  var e = Object.create(null),
    o = [];
  return (
    r.forEach(function (a) {
      for (var s in a) s in e || o.push((e[s] = s));
    }),
    o
  );
}
function c(r, e) {
  var o = r + '',
    a = o.length;
  return a < e ? new Array(e - a + 1).join(0) + o : o;
}
function H(r) {
  return r < 0 ? '-' + c(-r, 6) : r > 9999 ? '+' + c(r, 6) : c(r, 4);
}
function L(r) {
  var e = r.getUTCHours(),
    o = r.getUTCMinutes(),
    a = r.getUTCSeconds(),
    s = r.getUTCMilliseconds();
  return isNaN(r)
    ? 'Invalid Date'
    : H(r.getUTCFullYear(), 4) +
        '-' +
        c(r.getUTCMonth() + 1, 2) +
        '-' +
        c(r.getUTCDate(), 2) +
        (s
          ? 'T' + c(e, 2) + ':' + c(o, 2) + ':' + c(a, 2) + '.' + c(s, 3) + 'Z'
          : a
            ? 'T' + c(e, 2) + ':' + c(o, 2) + ':' + c(a, 2) + 'Z'
            : o || e
              ? 'T' + c(e, 2) + ':' + c(o, 2) + 'Z'
              : '');
}
function F(r) {
  var e = new RegExp(
      '["' +
        r +
        `
  \r]`
    ),
    o = r.charCodeAt(0);
  function a(t, n) {
    var u,
      i,
      f = s(t, function (l, m) {
        if (u) return u(l, m - 1);
        (i = l), (u = n ? Z(l, n) : P(l));
      });
    return (f.columns = i || []), f;
  }
  function s(t, n) {
    var u = [],
      i = t.length,
      f = 0,
      l = 0,
      m,
      N = i <= 0,
      d = !1;
    t.charCodeAt(i - 1) === w && --i, t.charCodeAt(i - 1) === E && --i;
    function U() {
      if (N) return A;
      if (d) return (d = !1), y;
      var T,
        g = f,
        R;
      if (t.charCodeAt(g) === x) {
        for (; (f++ < i && t.charCodeAt(f) !== x) || t.charCodeAt(++f) === x; );
        return (
          (T = f) >= i
            ? (N = !0)
            : (R = t.charCodeAt(f++)) === w
              ? (d = !0)
              : R === E && ((d = !0), t.charCodeAt(f) === w && ++f),
          t.slice(g + 1, T - 1).replace(/""/g, '"')
        );
      }
      for (; f < i; ) {
        if ((R = t.charCodeAt((T = f++))) === w) d = !0;
        else if (R === E) (d = !0), t.charCodeAt(f) === w && ++f;
        else if (R !== o) continue;
        return t.slice(g, T);
      }
      return (N = !0), t.slice(g, i);
    }
    for (; (m = U()) !== A; ) {
      for (var C = []; m !== y && m !== A; ) C.push(m), (m = U());
      (n && (C = n(C, l++)) == null) || u.push(C);
    }
    return u;
  }
  function j(t, n) {
    return t.map(function (u) {
      return n
        .map(function (i) {
          return h(u[i]);
        })
        .join(r);
    });
  }
  function I(t, n) {
    return (
      n == null && (n = D(t)),
      [n.map(h).join(r)].concat(j(t, n)).join(`
  `)
    );
  }
  function O(t, n) {
    return (
      n == null && (n = D(t)),
      j(t, n).join(`
  `)
    );
  }
  function M(t) {
    return t.map(B).join(`
  `);
  }
  function B(t) {
    return t.map(h).join(r);
  }
  function h(t) {
    return t == null
      ? ''
      : t instanceof Date
        ? L(t)
        : e.test((t += ''))
          ? '"' + t.replace(/"/g, '""') + '"'
          : t;
  }
  return {
    parse: a,
    parseRows: s,
    format: I,
    formatBody: O,
    formatRows: M,
    formatRow: B,
    formatValue: h,
  };
}
var p = F(','),
  S = p.parse,
  Y = p.parseRows,
  z = p.format,
  J = p.formatBody,
  Q = p.formatRows,
  W = p.formatRow,
  $ = p.formatValue;
var v = F('	'),
  k = v.parse,
  q = v.parseRows,
  G = v.format,
  K = v.formatBody,
  X = v.formatRows,
  _ = v.formatRow,
  b = v.formatValue;
function V(r) {
  for (var e in r) {
    var o = r[e].trim(),
      a,
      s;
    if (!o) o = null;
    else if (o === 'true') o = !0;
    else if (o === 'false') o = !1;
    else if (o === 'NaN') o = NaN;
    else if (!isNaN((a = +o))) o = a;
    else if (
      (s = o.match(
        /^([-+]\d{2})?\d{4}(-\d{2}(-\d{2})?)?(T\d{2}:\d{2}(:\d{2}(\.\d{3})?)?(Z|[-+]\d{2}:\d{2})?)?$/
      ))
    )
      rr && s[4] && !s[7] && (o = o.replace(/-/g, '/').replace(/T/, ' ')),
        (o = new Date(o));
    else continue;
    r[e] = o;
  }
  return r;
}
var rr =
  new Date('2019-01-01T00:00').getHours() ||
  new Date('2019-07-01T00:00').getHours();
export {
  V as autoType,
  z as csvFormat,
  J as csvFormatBody,
  W as csvFormatRow,
  Q as csvFormatRows,
  $ as csvFormatValue,
  S as csvParse,
  Y as csvParseRows,
  F as dsvFormat,
  G as tsvFormat,
  K as tsvFormatBody,
  _ as tsvFormatRow,
  X as tsvFormatRows,
  b as tsvFormatValue,
  k as tsvParse,
  q as tsvParseRows,
};
//# sourceMappingURL=d3-dsv.mjs.map
