/* eslint-disable @typescript-eslint/no-unused-expressions */

/* esm.sh - index-array-by@1.4.2 */
function g(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function j(e) {
  if (Array.isArray(e)) return e;
}
function P(e) {
  if (Array.isArray(e)) return g(e);
}
function O(e) {
  if (
    (typeof Symbol < 'u' && e[Symbol.iterator] != null) ||
    e['@@iterator'] != null
  )
    return Array.from(e);
}
function S(e, t) {
  var r =
    e == null
      ? null
      : (typeof Symbol < 'u' && e[Symbol.iterator]) || e['@@iterator'];
  if (r != null) {
    var n,
      l,
      s,
      f,
      i = [],
      u = !0,
      a = !1;
    try {
      if (((s = (r = r.call(e)).next), t !== 0))
        for (
          ;
          !(u = (n = s.call(r)).done) && (i.push(n.value), i.length !== t);
          u = !0
        );
    } catch (o) {
      (a = !0), (l = o);
    } finally {
      try {
        if (!u && r.return != null && ((f = r.return()), Object(f) !== f))
          return;
      } finally {
        if (a) throw l;
      }
    }
    return i;
  }
}
function _() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
  In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function w() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
  In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function I(e, t) {
  if (e == null) return {};
  var r,
    n,
    l = k(e, t);
  if (Object.getOwnPropertySymbols) {
    var s = Object.getOwnPropertySymbols(e);
    for (n = 0; n < s.length; n++)
      (r = s[n]),
        t.includes(r) || ({}.propertyIsEnumerable.call(e, r) && (l[r] = e[r]));
  }
  return l;
}
function k(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if ({}.hasOwnProperty.call(e, n)) {
      if (t.includes(n)) continue;
      r[n] = e[n];
    }
  return r;
}
function E(e, t) {
  return j(e) || S(e, t) || b(e, t) || _();
}
function T(e) {
  return P(e) || O(e) || b(e) || w();
}
function W(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return String(e);
}
function x(e) {
  var t = W(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function b(e, t) {
  if (e) {
    if (typeof e == 'string') return g(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return (
      r === 'Object' && e.constructor && (r = e.constructor.name),
      r === 'Map' || r === 'Set'
        ? Array.from(e)
        : r === 'Arguments' ||
            /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)
          ? g(e, t)
          : void 0
    );
  }
}
var K = function () {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [],
    t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [],
    r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0,
    n = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !1,
    l = (t instanceof Array ? (t.length ? t : [void 0]) : [t]).map(
      function (i) {
        return { keyAccessor: i, isProp: !(i instanceof Function) };
      }
    ),
    s = e.reduce(function (i, u) {
      var a = i,
        o = u;
      return (
        l.forEach(function (y, v) {
          var m = y.keyAccessor,
            p = y.isProp,
            c;
          if (p) {
            var h = o,
              d = h[m],
              A = I(h, [m].map(x));
            (c = d), (o = A);
          } else c = m(o, v);
          v + 1 < l.length
            ? (a.hasOwnProperty(c) || (a[c] = {}), (a = a[c]))
            : r
              ? (a.hasOwnProperty(c) || (a[c] = []), a[c].push(o))
              : (a[c] = o);
        }),
        i
      );
    }, {});
  r instanceof Function &&
    (function i(u) {
      var a =
        arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
      a === l.length
        ? Object.keys(u).forEach(function (o) {
            return (u[o] = r(u[o]));
          })
        : Object.values(u).forEach(function (o) {
            return i(o, a + 1);
          });
    })(s);
  var f = s;
  return (
    n &&
      ((f = []),
      (function i(u) {
        var a =
          arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
        a.length === l.length
          ? f.push({ keys: a, vals: u })
          : Object.entries(u).forEach(function (o) {
              var y = E(o, 2),
                v = y[0],
                m = y[1];
              return i(m, [].concat(T(a), [v]));
            });
      })(s),
      t instanceof Array &&
        t.length === 0 &&
        f.length === 1 &&
        (f[0].keys = [])),
    f
  );
};
export { K as default };
//# sourceMappingURL=index-array-by.mjs.map
