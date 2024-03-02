const {
    bindEvents,
    setCurrentTimeAsTimeout,
    createSizeObject
} = require('./content7.functions')

!function (e, t) {
    'use strict';
    'object' == typeof module && 'object' == typeof module.exports ? module.exports = e.document ? t(e, true) : function (e) {
        if (!e.document) {
            throw new Error('jQuery requires a window with a document');
        }
        return t(e);
    } : t(e);
}('undefined' != typeof window ? window : this, function (e, t) {
    'use strict';
    var n = [], r = Object.getPrototypeOf, i = n.slice, o = n.flat ? function (e) {
        return n.flat.call(e);
    } : function (e) {
        return n.concat.apply([], e);
    }, a = n.push, s = n.indexOf, u = {
        href: d.url,
        href: u.href
    }, l = u.toString, c = u.hasOwnProperty, f = c.toString, p = f.call(Object), d = {
        checkClone: ce.cloneNode(true).cloneNode(true).lastChild.checked,
        noCloneChecked: !!ce.cloneNode(true).lastChild.defaultValue,
        option: !!ce.lastChild,
        checkOn: '' !== e.value,
        optSelected: t.selected,
        radioValue: 't' === e.value,
        focusin: 'onfocusin' in e,
        crossDomain: Pt.protocol + '//' + Pt.host != u.protocol + '//' + u.host,
        crossDomain: true,
        cors: !!Wt && 'withCredentials' in Wt,
        ajax: Wt = !!Wt,
        createHTMLDocument: ((Ft = y.implementation.createHTMLDocument('').body).innerHTML = '<form></form><form></form>', 2 === Ft.childNodes.length)
    }, h = function (e) {
        return 'function' == typeof e && 'number' != typeof e.nodeType && 'function' != typeof e.item;
    }, g = function (e) {
        return null != e && e === e.window;
    }, y = e.document;
    function m(e, t, n) {
        var r, i, o = (n = n || y).createElement('script');
        if (o.text = e, t) {
            for (r in v)
                (i = t[r] || t.getAttribute && t.getAttribute(r)) && o.setAttribute(r, i);
        }
        n.head.appendChild(o).parentNode.removeChild(o);
    }
    function x(e) {
        return null == e ? e + '' : 'object' == typeof e || 'function' == typeof e ? u[l.call(e)] || 'object' : typeof e;
    }
    var utils0 = function (e, t) {
        return new utils0.fn.init(e, t);
    };
    function w(e) {
        var t = !!e && 'length' in e && e.length, n = x(e);
        return !h(e) && !g(e) && ('array' === n || 0 === t || 'number' == typeof t && t > 0 && t - 1 in e);
    }
    utils0.fn = utils0.prototype = {
        jquery: '3.6.0',
        constructor: utils0,
        length: 0,
        toArray: function () {
            return i.call(this);
        },
        get: function (e) {
            return null == e ? i.call(this) : e < 0 ? this[e + this.length] : this[e];
        },
        pushStack: function (e) {
            var t = utils0.merge(this.constructor(), e);
            return t.prevObject = this, t;
        },
        each: function (e) {
            return utils0.each(this, e);
        },
        map: function (e) {
            return this.pushStack(utils0.map(this, function (t, n) {
                return e.call(t, n, t);
            }));
        },
        slice: function () {
            return this.pushStack(i.apply(this, arguments));
        },
        first: function () {
            return this.eq(0);
        },
        last: function () {
            return this.eq(-1);
        },
        even: function () {
            return this.pushStack(utils0.grep(this, function (e, t) {
                return (t + 1) % 2;
            }));
        },
        odd: function () {
            return this.pushStack(utils0.grep(this, function (e, t) {
                return t % 2;
            }));
        },
        eq: function (e) {
            var t = this.length, n = +e + (e < 0 ? t : 0);
            return this.pushStack(n >= 0 && n < t ? [this[n]] : []);
        },
        end: function () {
            return this.prevObject || this.constructor();
        },
        push: a,
        sort: n.sort,
        splice: n.splice
    };
    utils0.extend = utils0.fn.extend = function () {
        var e, t, n, r, i, o, a = arguments[0] || {}, s = 1, u = arguments.length, l = false;
        for ('boolean' == typeof a && (l = a, a = arguments[s] || {}, s++), 'object' == typeof a || h(a) || (a = {}), s === u && (a = this, s--); s < u; s++) {
            if (null != (e = arguments[s])) {
                for (t in e)
                    r = e[t], '__proto__' !== t && a !== r && (l && r && (utils0.isPlainObject(r) || (i = Array.isArray(r))) ? (n = a[t], o = i && !Array.isArray(n) ? [] : i || utils0.isPlainObject(n) ? n : {}, i = false, a[t] = utils0.extend(l, o, r)) : void 0 !== r && (a[t] = r));
            }
        }
        return a;
    };
    utils0.extend({
        expando: 'jQuery' + ('3.6.0' + Math.random()).replace(/\D/g, ''),
        isReady: true,
        error: function (e) {
            throw new Error(e);
        },
        noop: function () {
        },
        isPlainObject: function (e) {
            var t, n;
            return !(!e || '[object Object]' !== l.call(e)) && (!(t = r(e)) || 'function' == typeof (n = c.call(t, 'constructor') && t.constructor) && f.call(n) === p);
        },
        isEmptyObject: function (e) {
            var t;
            for (t in e)
                return false;
            return true;
        },
        globalEval: function (e, t, n) {
            m(e, { nonce: t && t.nonce }, n);
        },
        each: function (e, t) {
            var n, r = 0;
            if (w(e)) {
                for (n = e.length; r < n && false !== t.call(e[r], r, e[r]); r++) {
                    ;
                }
            } else {
                for (r in e)
                    if (false === t.call(e[r], r, e[r])) {
                        break;
                    }
            }
            return e;
        },
        makeArray: function (e, t) {
            var n = t || [];
            return null != e && (w(Object(e)) ? utils0.merge(n, 'string' == typeof e ? [e] : e) : a.call(n, e)), n;
        },
        inArray: function (e, t, n) {
            return null == t ? -1 : s.call(t, e, n);
        },
        merge: function (e, t) {
            for (var n = +t.length, r = 0, i = e.length; r < n; r++) {
                e[i++] = t[r];
            }
            return e.length = i, e;
        },
        grep: function (e, t, n) {
            for (var r = [], i = 0, o = e.length, a = !n; i < o; i++) {
                !t(e[i], i) !== a && r.push(e[i]);
            }
            return r;
        },
        map: function (e, t, n) {
            var r, i, a = 0, s = [];
            if (w(e)) {
                for (r = e.length; a < r; a++) {
                    null != (i = t(e[a], a, n)) && s.push(i);
                }
            } else {
                for (a in e)
                    null != (i = t(e[a], a, n)) && s.push(i);
            }
            return o(s);
        },
        guid: 1,
        support: d
    });
    'function' == typeof Symbol && (utils0.fn[Symbol.iterator] = n[Symbol.iterator]);
    utils0.each('Boolean Number String Function Array Date RegExp Object Error Symbol'.split(' '), function (e, t) {
        u['[object ' + t + ']'] = t.toLowerCase();
    });
    var C = function (e) {
        var t, n, r, i, o, a, s, u, l, c, f, p, d, h, g, y, v, m, x, b = 'sizzle' + 1 * new Date(), w = e.document, C = 0, T = 0, S = ue(), E = ue(), A = ue(), j = ue(), k = function (e, t) {
            return e === t && (f = true), 0;
        }, D = {}.hasOwnProperty, N = [], L = N.pop, q = N.push, H = N.push, M = N.slice, P = function (e, t) {
            for (var n = 0, r = e.length; n < r; n++) {
                if (e[n] === t) {
                    return n;
                }
            }
            return -1;
        }, I = '(?:\\\\[\\da-fA-F]{1,6}[\\x20\\t\\r\\n\\f]?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+', B = '\\[[\\x20\\t\\r\\n\\f]*(' + I + ')(?:' + '[\\x20\\t\\r\\n\\f]' + '*([*^$|!~]?=)' + '[\\x20\\t\\r\\n\\f]' + '*(?:\'((?:\\\\.|[^\\\\\'])*)\'|"((?:\\\\.|[^\\\\"])*)"|(' + I + '))|)' + '[\\x20\\t\\r\\n\\f]' + '*\\]', W = ':(' + I + ')(?:\\(((\'((?:\\\\.|[^\\\\\'])*)\'|"((?:\\\\.|[^\\\\"])*)")|((?:\\\\.|[^\\\\()[\\]]|' + B + ')*)|.*)\\)|)', F = new RegExp('[\\x20\\t\\r\\n\\f]+', 'g'), $ = new RegExp('^[\\x20\\t\\r\\n\\f]+|((?:^|[^\\\\])(?:\\\\.)*)[\\x20\\t\\r\\n\\f]+$', 'g'), _ = new RegExp('^[\\x20\\t\\r\\n\\f]*,[\\x20\\t\\r\\n\\f]*'), G = new RegExp('^[\\x20\\t\\r\\n\\f]*([>+~]|[\\x20\\t\\r\\n\\f])[\\x20\\t\\r\\n\\f]*'), z = new RegExp('[\\x20\\t\\r\\n\\f]|>'), U = new RegExp(W), V = new RegExp('^' + I + '$'), X = {
            ID: new RegExp('^#(' + I + ')'),
            CLASS: new RegExp('^\\.(' + I + ')'),
            TAG: new RegExp('^(' + I + '|[*])'),
            ATTR: new RegExp('^' + B),
            PSEUDO: new RegExp('^' + W),
            CHILD: new RegExp('^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\([\\x20\\t\\r\\n\\f]*(even|odd|(([+-]|)(\\d*)n|)[\\x20\\t\\r\\n\\f]*(?:([+-]|)[\\x20\\t\\r\\n\\f]*(\\d+)|))[\\x20\\t\\r\\n\\f]*\\)|)', 'i'),
            bool: new RegExp('^(?:checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped)$', 'i'),
            needsContext: new RegExp('^[\\x20\\t\\r\\n\\f]*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\([\\x20\\t\\r\\n\\f]*((?:-\\d)?\\d*)[\\x20\\t\\r\\n\\f]*\\)|)(?=[^-]|$)', 'i')
        }, te = new RegExp('\\\\[\\da-fA-F]{1,6}[\\x20\\t\\r\\n\\f]?|\\\\([^\\r\\n\\f])', 'g'), ne = function (e, t) {
            var n = '0x' + e.slice(1) - 65536;
            return t || (n < 0 ? String.fromCharCode(n + 65536) : String.fromCharCode(n >> 10 | 55296, 1023 & n | 56320));
        }, ie = function (e, t) {
            return t ? '\0' === e ? '\uFFFD' : e.slice(0, -1) + '\\' + e.charCodeAt(e.length - 1).toString(16) + ' ' : '\\' + e;
        }, oe = function () {
            p();
        }, ae = be(function (e) {
            return true === e.disabled && 'fieldset' === e.nodeName.toLowerCase();
        }, {
            dir: 'parentNode',
            next: 'legend'
        });
        try {
            H.apply(N = M.call(w.childNodes), w.childNodes);
            N[w.childNodes.length].nodeType;
        } catch (e) {
            H = {
                apply: N.length ? function (e, t) {
                    q.apply(e, M.call(t));
                } : function (e, t) {
                    for (var n = e.length, r = 0; e[n++] = t[r++];) {
                        ;
                    }
                    e.length = n - 1;
                }
            };
        }
        function se(e, t, r, i) {
            var o, s, l, c, f, h, v, m = t && t.ownerDocument, w = t ? t.nodeType : 9;
            if (r = r || [], 'string' != typeof e || !e || 1 !== w && 9 !== w && 11 !== w) {
                return r;
            }
            if (!i && (p(t), t = t || d, g)) {
                if (11 !== w && (f = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/.exec(e))) {
                    if (o = f[1]) {
                        if (9 === w) {
                            if (!(l = t.getElementById(o))) {
                                return r;
                            }
                            if (l.id === o) {
                                return r.push(l), r;
                            }
                        } else {
                            if (m && (l = m.getElementById(o)) && x(t, l) && l.id === o) {
                                return r.push(l), r;
                            }
                        }
                    } else {
                        if (f[2]) {
                            return H.apply(r, t.getElementsByTagName(e)), r;
                        }
                        if ((o = f[3]) && n.getElementsByClassName && t.getElementsByClassName) {
                            return H.apply(r, t.getElementsByClassName(o)), r;
                        }
                    }
                }
                if (n.qsa && !j[e + ' '] && (!y || !y.test(e)) && (1 !== w || 'object' !== t.nodeName.toLowerCase())) {
                    if (v = e, m = t, 1 === w && (z.test(e) || G.test(e))) {
                        for ((m = /[+~]/.test(e) && ve(t.parentNode) || t) === t && n.scope || ((c = t.getAttribute('id')) ? c = c.replace(/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g, ie) : t.setAttribute('id', c = b)), s = (h = a(e)).length; s--;) {
                            h[s] = (c ? '#' + c : ':scope') + ' ' + xe(h[s]);
                        }
                        v = h.join(',');
                    }
                    try {
                        return H.apply(r, m.querySelectorAll(v)), r;
                    } catch (t) {
                        j(e, true);
                    } finally {
                        c === b && t.removeAttribute('id');
                    }
                }
            }
            return u(e.replace($, '$1'), t, r, i);
        }
        function ue() {
            var e = [];
            return function t(n, i) {
                return e.push(n + ' ') > r.cacheLength && delete t[e.shift()], t[n + ' '] = i;
            };
        }
        function le(e) {
            return e[b] = true, e;
        }
        function ce(e) {
            var t = d.createElement('fieldset');
            try {
                return !!e(t);
            } catch (e) {
                return false;
            } finally {
                t.parentNode && t.parentNode.removeChild(t);
                t = null;
            }
        }
        function fe(e, t) {
            for (var n = e.split('|'), i = n.length; i--;) {
                r.attrHandle[n[i]] = t;
            }
        }
        function pe(e, t) {
            var n = t && e, r = n && 1 === e.nodeType && 1 === t.nodeType && e.sourceIndex - t.sourceIndex;
            if (r) {
                return r;
            }
            if (n) {
                for (; n = n.nextSibling;) {
                    if (n === t) {
                        return -1;
                    }
                }
            }
            return e ? 1 : -1;
        }
        function de(e) {
            return function (t) {
                return 'input' === t.nodeName.toLowerCase() && t.type === e;
            };
        }
        function he(e) {
            return function (t) {
                var n = t.nodeName.toLowerCase();
                return ('input' === n || 'button' === n) && t.type === e;
            };
        }
        function ge(e) {
            return function (t) {
                return 'form' in t ? t.parentNode && false === t.disabled ? 'label' in t ? 'label' in t.parentNode ? t.parentNode.disabled === e : t.disabled === e : t.isDisabled === e || t.isDisabled !== !e && ae(t) === e : t.disabled === e : 'label' in t && t.disabled === e;
            };
        }
        function ye(e) {
            return le(function (t) {
                return t = +t, le(function (n, r) {
                    for (var i, o = e([], n.length, t), a = o.length; a--;) {
                        n[i = o[a]] && (n[i] = !(r[i] = n[i]));
                    }
                });
            });
        }
        function ve(e) {
            return e && void 0 !== e.getElementsByTagName && e;
        }
        for (t in (n = se.support = {}, o = se.isXML = function (e) {
            var t = e && e.namespaceURI, n = e && (e.ownerDocument || e).documentElement;
            return !/HTML$/i.test(t || n && n.nodeName || 'HTML');
        }, p = se.setDocument = function (e) {
            var t, i, a = e ? e.ownerDocument || e : w;
            return a != d && 9 === a.nodeType && a.documentElement ? (h = (d = a).documentElement, g = !o(d), w != d && (i = d.defaultView) && i.top !== i && (i.addEventListener ? i.addEventListener('unload', oe, false) : i.attachEvent && i.attachEvent('onunload', oe)), n.scope = ce(function (e) {
                return h.appendChild(e).appendChild(d.createElement('div')), void 0 !== e.querySelectorAll && !e.querySelectorAll(':scope fieldset div').length;
            }), n.attributes = ce(function (e) {
                return e.className = 'i', !e.getAttribute('className');
            }), n.getElementsByTagName = ce(function (e) {
                return e.appendChild(d.createComment('')), !e.getElementsByTagName('*').length;
            }), n.getElementsByClassName = /^[^{]+\{\s*\[native \w/.test(d.getElementsByClassName), n.getById = ce(function (e) {
                return h.appendChild(e).id = b, !d.getElementsByName || !d.getElementsByName(b).length;
            }), n.getById ? (r.filter.ID = function (e) {
                var t = e.replace(te, ne);
                return function (e) {
                    return e.getAttribute('id') === t;
                };
            }, r.find.ID = function (e, t) {
                if (void 0 !== t.getElementById && g) {
                    var n = t.getElementById(e);
                    return n ? [n] : [];
                }
            }) : (r.filter.ID = function (e) {
                var t = e.replace(te, ne);
                return function (e) {
                    var n = void 0 !== e.getAttributeNode && e.getAttributeNode('id');
                    return n && n.value === t;
                };
            }, r.find.ID = function (e, t) {
                if (void 0 !== t.getElementById && g) {
                    var n, r, i, o = t.getElementById(e);
                    if (o) {
                        if ((n = o.getAttributeNode('id')) && n.value === e) {
                            return [o];
                        }
                        for (i = t.getElementsByName(e), r = 0; o = i[r++];) {
                            if ((n = o.getAttributeNode('id')) && n.value === e) {
                                return [o];
                            }
                        }
                    }
                    return [];
                }
            }), r.find.TAG = n.getElementsByTagName ? function (e, t) {
                return void 0 !== t.getElementsByTagName ? t.getElementsByTagName(e) : n.qsa ? t.querySelectorAll(e) : void 0;
            } : function (e, t) {
                var n, r = [], i = 0, o = t.getElementsByTagName(e);
                if ('*' === e) {
                    for (; n = o[i++];) {
                        1 === n.nodeType && r.push(n);
                    }
                    return r;
                }
                return o;
            }, r.find.CLASS = n.getElementsByClassName && function (e, t) {
                if (void 0 !== t.getElementsByClassName && g) {
                    return t.getElementsByClassName(e);
                }
            }, v = [], y = [], (n.qsa = /^[^{]+\{\s*\[native \w/.test(d.querySelectorAll)) && (ce(function (e) {
                var t;
                h.appendChild(e).innerHTML = '<a id=\'' + b + '\'></a><select id=\'' + b + '-\r\\\' msallowcapture=\'\'><option selected=\'\'></option></select>';
                e.querySelectorAll('[msallowcapture^=\'\']').length && y.push('[*^$]=[\\x20\\t\\r\\n\\f]*(?:\'\'|"")');
                e.querySelectorAll('[selected]').length || y.push('\\[[\\x20\\t\\r\\n\\f]*(?:value|checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped)');
                e.querySelectorAll('[id~=' + b + '-]').length || y.push('~=');
                (t = d.createElement('input')).setAttribute('name', '');
                e.appendChild(t);
                e.querySelectorAll('[name=\'\']').length || y.push('\\[[\\x20\\t\\r\\n\\f]*name[\\x20\\t\\r\\n\\f]*=[\\x20\\t\\r\\n\\f]*(?:\'\'|"")');
                e.querySelectorAll(':checked').length || y.push(':checked');
                e.querySelectorAll('a#' + b + '+*').length || y.push('.#.+[+~]');
                e.querySelectorAll('\\\f');
                y.push('[\\r\\n\\f]');
            }), ce(function (e) {
                e.innerHTML = '<a href=\'\' disabled=\'disabled\'></a><select disabled=\'disabled\'><option/></select>';
                var t = d.createElement('input');
                t.setAttribute('type', 'hidden');
                e.appendChild(t).setAttribute('name', 'D');
                e.querySelectorAll('[name=d]').length && y.push('name[\\x20\\t\\r\\n\\f]*[*^$|!~]?=');
                2 !== e.querySelectorAll(':enabled').length && y.push(':enabled', ':disabled');
                h.appendChild(e).disabled = true;
                2 !== e.querySelectorAll(':disabled').length && y.push(':enabled', ':disabled');
                e.querySelectorAll('*,:x');
                y.push(',.*:');
            })), (n.matchesSelector = /^[^{]+\{\s*\[native \w/.test(m = h.matches || h.webkitMatchesSelector || h.mozMatchesSelector || h.oMatchesSelector || h.msMatchesSelector)) && ce(function (e) {
                n.disconnectedMatch = m.call(e, '*');
                m.call(e, '[s!=\'\']:x');
                v.push('!=', W);
            }), y = y.length && new RegExp(y.join('|')), v = v.length && new RegExp(v.join('|')), t = /^[^{]+\{\s*\[native \w/.test(h.compareDocumentPosition), x = t || /^[^{]+\{\s*\[native \w/.test(h.contains) ? function (e, t) {
                var n = 9 === e.nodeType ? e.documentElement : e, r = t && t.parentNode;
                return e === r || !(!r || 1 !== r.nodeType || !(n.contains ? n.contains(r) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(r)));
            } : function (e, t) {
                if (t) {
                    for (; t = t.parentNode;) {
                        if (t === e) {
                            return true;
                        }
                    }
                }
                return false;
            }, k = t ? function (e, t) {
                if (e === t) {
                    return f = true, 0;
                }
                var r = !e.compareDocumentPosition - !t.compareDocumentPosition;
                return r || (1 & (r = (e.ownerDocument || e) == (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1) || !n.sortDetached && t.compareDocumentPosition(e) === r ? e == d || e.ownerDocument == w && x(w, e) ? -1 : t == d || t.ownerDocument == w && x(w, t) ? 1 : c ? P(c, e) - P(c, t) : 0 : 4 & r ? -1 : 1);
            } : function (e, t) {
                if (e === t) {
                    return f = true, 0;
                }
                var n, r = 0, i = e.parentNode, o = t.parentNode, a = [e], s = [t];
                if (!i || !o) {
                    return e == d ? -1 : t == d ? 1 : i ? -1 : o ? 1 : c ? P(c, e) - P(c, t) : 0;
                }
                if (i === o) {
                    return pe(e, t);
                }
                for (n = e; n = n.parentNode;) {
                    a.unshift(n);
                }
                for (n = t; n = n.parentNode;) {
                    s.unshift(n);
                }
                for (; a[r] === s[r];) {
                    r++;
                }
                return r ? pe(a[r], s[r]) : a[r] == w ? -1 : s[r] == w ? 1 : 0;
            }, d) : d;
        }, se.matches = function (e, t) {
            return se(e, null, null, t);
        }, se.matchesSelector = function (e, t) {
            if (p(e), n.matchesSelector && g && !j[t + ' '] && (!v || !v.test(t)) && (!y || !y.test(t))) {
                try {
                    var r = m.call(e, t);
                    if (r || n.disconnectedMatch || e.document && 11 !== e.document.nodeType) {
                        return r;
                    }
                } catch (e) {
                    j(t, true);
                }
            }
            return se(t, d, null, [e]).length > 0;
        }, se.contains = function (e, t) {
            return (e.ownerDocument || e) != d && p(e), x(e, t);
        }, se.attr = function (e, t) {
            (e.ownerDocument || e) != d && p(e);
            var i = r.attrHandle[t.toLowerCase()], o = i && D.call(r.attrHandle, t.toLowerCase()) ? i(e, t, !g) : void 0;
            return void 0 !== o ? o : n.attributes || !g ? e.getAttribute(t) : (o = e.getAttributeNode(t)) && o.specified ? o.value : null;
        }, se.escape = function (e) {
            return (e + '').replace(/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g, ie);
        }, se.error = function (e) {
            throw new Error('Syntax error, unrecognized expression: ' + e);
        }, se.uniqueSort = function (e) {
            var t, r = [], i = 0, o = 0;
            if (f = !n.detectDuplicates, c = !n.sortStable && e.slice(0), e.sort(k), f) {
                for (; t = e[o++];) {
                    t === e[o] && (i = r.push(o));
                }
                for (; i--;) {
                    e.splice(r[i], 1);
                }
            }
            return c = null, e;
        }, i = se.getText = function (e) {
            var t, n = '', r = 0, o = e.nodeType;
            if (o) {
                if (1 === o || 9 === o || 11 === o) {
                    if ('string' == typeof e.textContent) {
                        return e.textContent;
                    }
                    for (e = e.firstChild; e; e = e.nextSibling) {
                        n += i(e);
                    }
                } else {
                    if (3 === o || 4 === o) {
                        return e.nodeValue;
                    }
                }
            } else {
                for (; t = e[r++];) {
                    n += i(t);
                }
            }
            return n;
        }, (r = se.selectors = {
            cacheLength: 50,
            createPseudo: le,
            match: X,
            attrHandle: {},
            find: {},
            relative: {
                '>': {
                    dir: 'parentNode',
                    first: true
                },
                ' ': { dir: 'parentNode' },
                '+': {
                    dir: 'previousSibling',
                    first: true
                },
                '~': { dir: 'previousSibling' }
            },
            preFilter: {
                ATTR: function (e) {
                    return e[1] = e[1].replace(te, ne), e[3] = (e[3] || e[4] || e[5] || '').replace(te, ne), '~=' === e[2] && (e[3] = ' ' + e[3] + ' '), e.slice(0, 4);
                },
                CHILD: function (e) {
                    return e[1] = e[1].toLowerCase(), 'nth' === e[1].slice(0, 3) ? (e[3] || se.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ('even' === e[3] || 'odd' === e[3])), e[5] = +(e[7] + e[8] || 'odd' === e[3])) : e[3] && se.error(e[0]), e;
                },
                PSEUDO: function (e) {
                    var t, n = !e[6] && e[2];
                    return X.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || '' : n && U.test(n) && (t = a(n, true)) && (t = n.indexOf(')', n.length - t) - n.length) && (e[0] = e[0].slice(0, t), e[2] = n.slice(0, t)), e.slice(0, 3));
                }
            },
            filter: {
                TAG: function (e) {
                    var t = e.replace(te, ne).toLowerCase();
                    return '*' === e ? function () {
                        return true;
                    } : function (e) {
                        return e.nodeName && e.nodeName.toLowerCase() === t;
                    };
                },
                CLASS: function (e) {
                    var t = S[e + ' '];
                    return t || (t = new RegExp('(^|[\\x20\\t\\r\\n\\f])' + e + '(' + '[\\x20\\t\\r\\n\\f]' + '|$)')) && S(e, function (e) {
                        return t.test('string' == typeof e.className && e.className || void 0 !== e.getAttribute && e.getAttribute('class') || '');
                    });
                },
                ATTR: function (e, t, n) {
                    return function (r) {
                        var i = se.attr(r, e);
                        return null == i ? '!=' === t : !t || (i += '', '=' === t ? i === n : '!=' === t ? i !== n : '^=' === t ? n && 0 === i.indexOf(n) : '*=' === t ? n && i.indexOf(n) > -1 : '$=' === t ? n && i.slice(-n.length) === n : '~=' === t ? (' ' + i.replace(F, ' ') + ' ').indexOf(n) > -1 : '|=' === t && (i === n || i.slice(0, n.length + 1) === n + '-'));
                    };
                },
                CHILD: function (e, t, n, r, i) {
                    var o = 'nth' !== e.slice(0, 3), a = 'last' !== e.slice(-4), s = 'of-type' === t;
                    return 1 === r && 0 === i ? function (e) {
                        return !!e.parentNode;
                    } : function (t, n, u) {
                        var l, c, f, p, d, h, g = o !== a ? 'nextSibling' : 'previousSibling', y = t.parentNode, v = s && t.nodeName.toLowerCase(), m = !u && !s, x = false;
                        if (y) {
                            if (o) {
                                for (; g;) {
                                    for (p = t; p = p[g];) {
                                        if (s ? p.nodeName.toLowerCase() === v : 1 === p.nodeType) {
                                            return false;
                                        }
                                    }
                                    h = g = 'only' === e && !h && 'nextSibling';
                                }
                                return true;
                            }
                            if (h = [a ? y.firstChild : y.lastChild], a && m) {
                                for (x = (d = (l = (c = (f = (p = y)[b] || (p[b] = {}))[p.uniqueID] || (f[p.uniqueID] = {}))[e] || [])[0] === C && l[1]) && l[2], p = d && y.childNodes[d]; p = ++d && p && p[g] || (x = d = 0) || h.pop();) {
                                    if (1 === p.nodeType && ++x && p === t) {
                                        c[e] = [
                                            C,
                                            d,
                                            x
                                        ];
                                        break;
                                    }
                                }
                            } else {
                                if (m && (x = d = (l = (c = (f = (p = t)[b] || (p[b] = {}))[p.uniqueID] || (f[p.uniqueID] = {}))[e] || [])[0] === C && l[1]), false === x) {
                                    for (; (p = ++d && p && p[g] || (x = d = 0) || h.pop()) && ((s ? p.nodeName.toLowerCase() !== v : 1 !== p.nodeType) || !++x || (m && ((c = (f = p[b] || (p[b] = {}))[p.uniqueID] || (f[p.uniqueID] = {}))[e] = [
                                        C,
                                        x
                                    ]), p !== t));) {
                                        ;
                                    }
                                }
                            }
                            return (x -= i) === r || x % r == 0 && x / r >= 0;
                        }
                    };
                },
                PSEUDO: function (e, t) {
                    var n, i = r.pseudos[e] || r.setFilters[e.toLowerCase()] || se.error('unsupported pseudo: ' + e);
                    return i[b] ? i(t) : i.length > 1 ? (n = [
                        e,
                        e,
                        '',
                        t
                    ], r.setFilters.hasOwnProperty(e.toLowerCase()) ? le(function (e, n) {
                        for (var r, o = i(e, t), a = o.length; a--;) {
                            e[r = P(e, o[a])] = !(n[r] = o[a]);
                        }
                    }) : function (e) {
                        return i(e, 0, n);
                    }) : i;
                }
            },
            pseudos: {
                not: le(function (e) {
                    var t = [], n = [], r = s(e.replace($, '$1'));
                    return r[b] ? le(function (e, t, n, i) {
                        for (var o, a = r(e, null, i, []), s = e.length; s--;) {
                            (o = a[s]) && (e[s] = !(t[s] = o));
                        }
                    }) : function (e, i, o) {
                        return t[0] = e, r(t, null, o, n), t[0] = null, !n.pop();
                    };
                }),
                has: le(function (e) {
                    return function (t) {
                        return se(e, t).length > 0;
                    };
                }),
                contains: le(function (e) {
                    return e = e.replace(te, ne), function (t) {
                        return (t.textContent || i(t)).indexOf(e) > -1;
                    };
                }),
                lang: le(function (e) {
                    return V.test(e || '') || se.error('unsupported lang: ' + e), e = e.replace(te, ne).toLowerCase(), function (t) {
                        var n;
                        do {
                            if (n = g ? t.lang : t.getAttribute('xml:lang') || t.getAttribute('lang')) {
                                return (n = n.toLowerCase()) === e || 0 === n.indexOf(e + '-');
                            }
                        } while ((t = t.parentNode) && 1 === t.nodeType);
                        return false;
                    };
                }),
                target: function (t) {
                    var n = e.location && e.location.hash;
                    return n && n.slice(1) === t.id;
                },
                root: function (e) {
                    return e === h;
                },
                focus: function (e) {
                    return e === d.activeElement && (!d.hasFocus || d.hasFocus()) && !!(e.type || e.href || ~e.tabIndex);
                },
                enabled: ge(false),
                disabled: ge(true),
                checked: function (e) {
                    var t = e.nodeName.toLowerCase();
                    return 'input' === t && !!e.checked || 'option' === t && !!e.selected;
                },
                selected: function (e) {
                    return e.parentNode && e.parentNode.selectedIndex, true === e.selected;
                },
                empty: function (e) {
                    for (e = e.firstChild; e; e = e.nextSibling) {
                        if (e.nodeType < 6) {
                            return false;
                        }
                    }
                    return true;
                },
                parent: function (e) {
                    return !r.pseudos.empty(e);
                },
                header: function (e) {
                    return /^h\d$/i.test(e.nodeName);
                },
                input: function (e) {
                    return /^(?:input|select|textarea|button)$/i.test(e.nodeName);
                },
                button: function (e) {
                    var t = e.nodeName.toLowerCase();
                    return 'input' === t && 'button' === e.type || 'button' === t;
                },
                text: function (e) {
                    var t;
                    return 'input' === e.nodeName.toLowerCase() && 'text' === e.type && (null == (t = e.getAttribute('type')) || 'text' === t.toLowerCase());
                },
                first: ye(function () {
                    return [0];
                }),
                last: ye(function (e, t) {
                    return [t - 1];
                }),
                eq: ye(function (e, t, n) {
                    return [n < 0 ? n + t : n];
                }),
                even: ye(function (e, t) {
                    for (var n = 0; n < t; n += 2) {
                        e.push(n);
                    }
                    return e;
                }),
                odd: ye(function (e, t) {
                    for (var n = 1; n < t; n += 2) {
                        e.push(n);
                    }
                    return e;
                }),
                lt: ye(function (e, t, n) {
                    for (var r = n < 0 ? n + t : n > t ? t : n; --r >= 0;) {
                        e.push(r);
                    }
                    return e;
                }),
                gt: ye(function (e, t, n) {
                    for (var r = n < 0 ? n + t : n; ++r < t;) {
                        e.push(r);
                    }
                    return e;
                })
            }
        }).pseudos.nth = r.pseudos.eq, {
            radio: true,
            checkbox: true,
            file: true,
            password: true,
            image: true
        }))
            r.pseudos[t] = de(t);
        for (t in {
            submit: true,
            reset: true
        })
            r.pseudos[t] = he(t);
        function me() {
        }
        function xe(e) {
            for (var t = 0, n = e.length, r = ''; t < n; t++) {
                r += e[t].value;
            }
            return r;
        }
        function be(e, t, n) {
            var r = t.dir, i = t.next, o = i || r, a = n && 'parentNode' === o, s = T++;
            return t.first ? function (t, n, i) {
                for (; t = t[r];) {
                    if (1 === t.nodeType || a) {
                        return e(t, n, i);
                    }
                }
                return false;
            } : function (t, n, u) {
                var l, c, f, p = [
                    C,
                    s
                ];
                if (u) {
                    for (; t = t[r];) {
                        if ((1 === t.nodeType || a) && e(t, n, u)) {
                            return true;
                        }
                    }
                } else {
                    for (; t = t[r];) {
                        if (1 === t.nodeType || a) {
                            if (c = (f = t[b] || (t[b] = {}))[t.uniqueID] || (f[t.uniqueID] = {}), i && i === t.nodeName.toLowerCase()) {
                                t = t[r] || t;
                            } else {
                                if ((l = c[o]) && l[0] === C && l[1] === s) {
                                    return p[2] = l[2];
                                }
                                if (c[o] = p, p[2] = e(t, n, u)) {
                                    return true;
                                }
                            }
                        }
                    }
                }
                return false;
            };
        }
        function we(e) {
            return e.length > 1 ? function (t, n, r) {
                for (var i = e.length; i--;) {
                    if (!e[i](t, n, r)) {
                        return false;
                    }
                }
                return true;
            } : e[0];
        }
        function Ce(e, t, n, r, i) {
            for (var o, a = [], s = 0, u = e.length, l = null != t; s < u; s++) {
                (o = e[s]) && (n && !n(o, r, i) || (a.push(o), l && t.push(s)));
            }
            return a;
        }
        function manageElementCallbacks(selector, filters, preCallback, removalCallback, addCallback, context) {
            // Normalize callback functions
            if (removalCallback && !removalCallback.isNormalized) {
                removalCallback = manageElementCallbacks(removalCallback);
            }
            if (addCallback && !addCallback.isNormalized) {
                addCallback = manageElementCallbacks(addCallback, context);
            }

            // Main logic wrapped in a closure
            return le(function (matchedElements, elementsToManipulate, contextNode, userData) {
                var removedIndices = [],
                    addedIndices = [],
                    originalElementsCount = elementsToManipulate.length,
                    matchedElementsArray = matchedElements || selectAll(filters || '*', contextNode.nodeType ? [contextNode] : contextNode, []),
                    filteredElements = !selector || !matchedElements ? matchedElementsArray : filterElements(matchedElementsArray, removedIndices, selector, contextNode, userData),
                    manipulatedElements = preCallback ? addCallback || (matchedElements ? selector : originalElementsCount || removalCallback) ? [] : elementsToManipulate : filteredElements;

                // Execute pre-callback if provided
                if (preCallback) {
                    preCallback(filteredElements, manipulatedElements, contextNode, userData);
                }

                // Execute removal callback if provided
                if (removalCallback) {
                    var removedElements = filterElements(manipulatedElements, addedIndices);
                    removalCallback(removedElements, [], contextNode, userData);
                    for (var index = removedElements.length; index--;) {
                        var removedElement = removedElements[index];
                        if (removedElement) {
                            manipulatedElements[addedIndices[index]] = !(filteredElements[addedIndices[index]] = removedElement);
                        }
                    }
                }

                // Handle element addition/removal
                if (matchedElements) {
                    if (addCallback || selector) {
                        if (addCallback) {
                            var addedElements = [];
                            for (var index = manipulatedElements.length; index--;) {
                                var element = manipulatedElements[index];
                                if (element) {
                                    addedElements.push(filteredElements[index] = element);
                                }
                            }
                            addCallback(null, manipulatedElements = [], addedElements, userData);
                        }
                        for (var index = manipulatedElements.length; index--;) {
                            var element = manipulatedElements[index];
                            if (element) {
                                var filteredIndex = addCallback ? indexOf(matchedElements, element) : removedIndices[index];
                                if (filteredIndex > -1) {
                                    matchedElements[filteredIndex] = !(elementsToManipulate[filteredIndex] = element);
                                }
                            }
                        }
                    }
                } else {
                    // Handle direct element manipulation
                    manipulatedElements = filterElements(manipulatedElements === elementsToManipulate ? manipulatedElements.splice(originalElementsCount, manipulatedElements.length) : manipulatedElements);
                    if (addCallback) {
                        addCallback(null, elementsToManipulate, manipulatedElements, userData);
                    } else {
                        H.apply(elementsToManipulate, manipulatedElements);
                    }
                }
            });
        }

        function Se(e) {
            for (var t, n, i, o = e.length, a = r.relative[e[0].type], s = a || r.relative[' '], u = a ? 1 : 0, c = be(function (e) {
                return e === t;
            }, s, true), f = be(function (e) {
                return P(t, e) > -1;
            }, s, true), p = [function (e, n, r) {
                var i = !a && (r || n !== l) || ((t = n).nodeType ? c(e, n, r) : f(e, n, r));
                return t = null, i;
            }]; u < o; u++) {
                if (n = r.relative[e[u].type]) {
                    p = [be(we(p), n)];
                } else {
                    if ((n = r.filter[e[u].type].apply(null, e[u].matches))[b]) {
                        for (i = ++u; i < o && !r.relative[e[i].type]; i++) {
                            ;
                        }
                        return manageElementCallbacks(u > 1 && we(p), u > 1 && xe(e.slice(0, u - 1).concat({ value: ' ' === e[u - 2].type ? '*' : '' })).replace($, '$1'), n, u < i && Se(e.slice(u, i)), i < o && Se(e = e.slice(i)), i < o && xe(e));
                    }
                    p.push(n);
                }
            }
            return we(p);
        }
        return me.prototype = r.filters = r.pseudos, r.setFilters = new me(), a = se.tokenize = function (e, t) {
            var n, i, o, a, s, u, l, c = E[e + ' '];
            if (c) {
                return t ? 0 : c.slice(0);
            }
            for (s = e, u = [], l = r.preFilter; s;) {
                for (a in (n && !(i = _.exec(s)) || (i && (s = s.slice(i[0].length) || s), u.push(o = [])), n = false, (i = G.exec(s)) && (n = i.shift(), o.push({
                    value: n,
                    type: i[0].replace($, ' ')
                }), s = s.slice(n.length)), r.filter))
                    !(i = X[a].exec(s)) || l[a] && !(i = l[a](i)) || (n = i.shift(), o.push({
                        value: n,
                        type: a,
                        matches: i
                    }), s = s.slice(n.length));
                if (!n) {
                    break;
                }
            }
            return t ? s.length : s ? se.error(e) : E(e, u).slice(0);
        }, s = se.compile = function (e, t) {
            var n, i = [], o = [], s = A[e + ' '];
            if (!s) {
                for (t || (t = a(e)), n = t.length; n--;) {
                    (s = Se(t[n]))[b] ? i.push(s) : o.push(s);
                }
                (s = A(e, function (e, t) {
                    var n = t.length > 0, i = e.length > 0, o = function (o, a, s, u, c) {
                        var f, h, y, v = 0, m = '0', x = o && [], b = [], w = l, T = o || i && r.find.TAG('*', c), S = C += null == w ? 1 : Math.random() || 0.1, E = T.length;
                        for (c && (l = a == d || a || c); m !== E && null != (f = T[m]); m++) {
                            if (i && f) {
                                for (h = 0, a || f.ownerDocument == d || (p(f), s = !g); y = e[h++];) {
                                    if (y(f, a || d, s)) {
                                        u.push(f);
                                        break;
                                    }
                                }
                                c && (C = S);
                            }
                            n && ((f = !y && f) && v--, o && x.push(f));
                        }
                        if (v += m, n && m !== v) {
                            for (h = 0; y = t[h++];) {
                                y(x, b, a, s);
                            }
                            if (o) {
                                if (v > 0) {
                                    for (; m--;) {
                                        x[m] || b[m] || (b[m] = L.call(u));
                                    }
                                }
                                b = Ce(b);
                            }
                            H.apply(u, b);
                            c && !o && b.length > 0 && v + t.length > 1 && se.uniqueSort(u);
                        }
                        return c && (C = S, l = w), x;
                    };
                    return n ? le(o) : o;
                }(o, i))).selector = e;
            }
            return s;
        }, u = se.select = function (e, t, n, i) {
            var o, u, l, c, f, p = 'function' == typeof e && e, d = !i && a(e = p.selector || e);
            if (n = n || [], 1 === d.length) {
                if ((u = d[0] = d[0].slice(0)).length > 2 && 'ID' === (l = u[0]).type && 9 === t.nodeType && g && r.relative[u[1].type]) {
                    if (!(t = (r.find.ID(l.matches[0].replace(te, ne), t) || [])[0])) {
                        return n;
                    }
                    p && (t = t.parentNode);
                    e = e.slice(u.shift().value.length);
                }
                for (o = X.needsContext.test(e) ? 0 : u.length; o-- && (l = u[o], !r.relative[c = l.type]);) {
                    if ((f = r.find[c]) && (i = f(l.matches[0].replace(te, ne), /[+~]/.test(u[0].type) && ve(t.parentNode) || t))) {
                        if (u.splice(o, 1), !(e = i.length && xe(u))) {
                            return H.apply(n, i), n;
                        }
                        break;
                    }
                }
            }
            return (p || s(e, d))(i, t, !g, n, !t || /[+~]/.test(e) && ve(t.parentNode) || t), n;
        }, n.sortStable = b.split('').sort(k).join('') === b, n.detectDuplicates = !!f, p(), n.sortDetached = ce(function (e) {
            return 1 & e.compareDocumentPosition(d.createElement('fieldset'));
        }), ce(function (e) {
            return e.innerHTML = '<a href=\'#\'></a>', '#' === e.firstChild.getAttribute('href');
        }) || fe('type|href|height|width', function (e, t, n) {
            if (!n) {
                return e.getAttribute(t, 'type' === t.toLowerCase() ? 1 : 2);
            }
        }), n.attributes && ce(function (e) {
            return e.innerHTML = '<input/>', e.firstChild.setAttribute('value', ''), '' === e.firstChild.getAttribute('value');
        }) || fe('value', function (e, t, n) {
            if (!n && 'input' === e.nodeName.toLowerCase()) {
                return e.defaultValue;
            }
        }), ce(function (e) {
            return null == e.getAttribute('disabled');
        }) || fe('checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped', function (e, t, n) {
            var r;
            if (!n) {
                return true === e[t] ? t.toLowerCase() : (r = e.getAttributeNode(t)) && r.specified ? r.value : null;
            }
        }), se;
    }(e);
    utils0.find = C;
    utils0.expr = C.selectors;
    utils0.expr[':'] = utils0.expr.pseudos;
    utils0.uniqueSort = utils0.unique = C.uniqueSort;
    utils0.text = C.getText;
    utils0.isXMLDoc = C.isXML;
    utils0.contains = C.contains;
    utils0.escapeSelector = C.escape;
    var T = function (e, t, n) {
        for (var r = [], i = void 0 !== n; (e = e[t]) && 9 !== e.nodeType;) {
            if (1 === e.nodeType) {
                if (i && utils0(e).is(n)) {
                    break;
                }
                r.push(e);
            }
        }
        return r;
    }, S = function (e, t) {
        for (var n = []; e; e = e.nextSibling) {
            1 === e.nodeType && e !== t && n.push(e);
        }
        return n;
    }, E = utils0.expr.match.needsContext;
    function A(e, t) {
        return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase();
    }
    ;
    function k(e, t, n) {
        return h(t) ? utils0.grep(e, function (e, r) {
            return !!t.call(e, r, e) !== n;
        }) : t.nodeType ? utils0.grep(e, function (e) {
            return e === t !== n;
        }) : 'string' != typeof t ? utils0.grep(e, function (e) {
            return s.call(t, e) > -1 !== n;
        }) : utils0.filter(t, e, n);
    }
    utils0.filter = function (e, t, n) {
        var r = t[0];
        return n && (e = ':not(' + e + ')'), 1 === t.length && 1 === r.nodeType ? utils0.find.matchesSelector(r, e) ? [r] : [] : utils0.find.matches(e, utils0.grep(t, function (e) {
            return 1 === e.nodeType;
        }));
    };
    utils0.fn.extend({
        find: function (e) {
            var t, n, r = this.length, i = this;
            if ('string' != typeof e) {
                return this.pushStack(utils0(e).filter(function () {
                    for (t = 0; t < r; t++) {
                        if (utils0.contains(i[t], this)) {
                            return true;
                        }
                    }
                }));
            }
            for (n = this.pushStack([]), t = 0; t < r; t++) {
                utils0.find(e, i[t], n);
            }
            return r > 1 ? utils0.uniqueSort(n) : n;
        },
        filter: function (e) {
            return this.pushStack(k(this, e || [], false));
        },
        not: function (e) {
            return this.pushStack(k(this, e || [], true));
        },
        is: function (e) {
            return !!k(this, 'string' == typeof e && E.test(e) ? utils0(e) : e || [], false).length;
        }
    });
    var D;
    (utils0.fn.init = function (e, t, n) {
        var r, i;
        if (!e) {
            return this;
        }
        if (n = n || D, 'string' == typeof e) {
            if (!(r = '<' === e[0] && '>' === e[e.length - 1] && e.length >= 3 ? [
                null,
                e,
                null
            ] : /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/.exec(e)) || !r[1] && t) {
                return !t || t.jquery ? (t || n).find(e) : this.constructor(t).find(e);
            }
            if (r[1]) {
                if (t = t instanceof utils0 ? t[0] : t, utils0.merge(this, utils0.parseHTML(r[1], t && t.nodeType ? t.ownerDocument || t : y, true)), /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i.test(r[1]) && utils0.isPlainObject(t)) {
                    for (r in t)
                        h(this[r]) ? this[r](t[r]) : this.attr(r, t[r]);
                }
                return this;
            }
            return (i = y.getElementById(r[2])) && (this[0] = i, this.length = 1), this;
        }
        return e.nodeType ? (this[0] = e, this.length = 1, this) : h(e) ? void 0 !== n.ready ? n.ready(e) : e(utils0) : utils0.makeArray(e, this);
    }).prototype = utils0.fn;
    D = utils0(y);
    ;
    function H(e, t) {
        for (; (e = e[t]) && 1 !== e.nodeType;) {
            ;
        }
        return e;
    }
    utils0.fn.extend({
        has: function (e) {
            var t = utils0(e, this), n = t.length;
            return this.filter(function () {
                for (var e = 0; e < n; e++) {
                    if (utils0.contains(this, t[e])) {
                        return true;
                    }
                }
            });
        },
        closest: function (e, t) {
            var n, r = 0, i = this.length, o = [], a = 'string' != typeof e && utils0(e);
            if (!E.test(e)) {
                for (; r < i; r++) {
                    for (n = this[r]; n && n !== t; n = n.parentNode) {
                        if (n.nodeType < 11 && (a ? a.index(n) > -1 : 1 === n.nodeType && utils0.find.matchesSelector(n, e))) {
                            o.push(n);
                            break;
                        }
                    }
                }
            }
            return this.pushStack(o.length > 1 ? utils0.uniqueSort(o) : o);
        },
        index: function (e) {
            return e ? 'string' == typeof e ? s.call(utils0(e), this[0]) : s.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
        },
        add: function (e, t) {
            return this.pushStack(utils0.uniqueSort(utils0.merge(this.get(), utils0(e, t))));
        },
        addBack: function (e) {
            return this.add(null == e ? this.prevObject : this.prevObject.filter(e));
        }
    });
    utils0.each({
        parent: function (e) {
            var t = e.parentNode;
            return t && 11 !== t.nodeType ? t : null;
        },
        parents: function (e) {
            return T(e, 'parentNode');
        },
        parentsUntil: function (e, t, n) {
            return T(e, 'parentNode', n);
        },
        next: function (e) {
            return H(e, 'nextSibling');
        },
        prev: function (e) {
            return H(e, 'previousSibling');
        },
        nextAll: function (e) {
            return T(e, 'nextSibling');
        },
        prevAll: function (e) {
            return T(e, 'previousSibling');
        },
        nextUntil: function (e, t, n) {
            return T(e, 'nextSibling', n);
        },
        prevUntil: function (e, t, n) {
            return T(e, 'previousSibling', n);
        },
        siblings: function (e) {
            return S((e.parentNode || {}).firstChild, e);
        },
        children: function (e) {
            return S(e.firstChild);
        },
        contents: function (e) {
            return null != e.contentDocument && r(e.contentDocument) ? e.contentDocument : (A(e, 'template') && (e = e.content || e), utils0.merge([], e.childNodes));
        }
    }, function (e, t) {
        utils0.fn[e] = function (n, r) {
            var i = utils0.map(this, t, n);
            return 'Until' !== e.slice(-5) && (r = n), r && 'string' == typeof r && (i = utils0.filter(r, i)), this.length > 1 && (q[e] || utils0.uniqueSort(i), /^(?:parents|prev(?:Until|All))/.test(e) && i.reverse()), this.pushStack(i);
        };
    });
    ;
    function P(e) {
        return e;
    }
    function O(e) {
        throw e;
    }
    function R(e, t, n, r) {
        var i;
        try {
            e && h(i = e.promise) ? i.call(e).done(t).fail(n) : e && h(i = e.then) ? i.call(e, t, n) : t.apply(void 0, [e].slice(r));
        } catch (e) {
            n.apply(void 0, [e]);
        }
    }
    utils0.Callbacks = function (options) {
        var callbacks = [],
            memory,
            fired,
            locked,
            firingIndex = -1;

        if (typeof options === 'string') {
            options = (function (opts) {
                var parsed = {};
                opts.match(/[^\x20\t\r\n\f]+/g) || [].forEach(function (val) {
                    parsed[val] = true;
                });
                return parsed;
            })(options);
        } else {
            options = utils0.extend({}, options);
        }

        var fireCallbacks = function () {
            memory = options.once;
            fired = true;
            locked = true;

            for (; callbacks.length;) {
                var args = callbacks.shift();
                firingIndex = -1;
                while (++firingIndex < callbacks.length) {
                    if (false === callbacks[firingIndex].apply(args[0], args[1]) && options.stopOnFalse) {
                        firingIndex = callbacks.length;
                        args = false;
                    }
                }
            }

            if (!options.memory) {
                args = false;
            }
            locked = false;

            if (memory) {
                callbacks = args ? [] : '';
            }
        };

        var api = {
            add: function () {
                if (callbacks) {
                    if (arguments.length) {
                        if (!locked) {
                            fireCallbacks();
                        }

                        (function add(args) {
                            args.forEach(function (arg) {
                                if (typeof arg === 'function') {
                                    if (options.unique && !api.has(arg)) {
                                        callbacks.push(arg);
                                    }
                                } else if (arg && arg.length && typeof arg !== 'string') {
                                    add(arg);
                                }
                            });
                        })(Array.from(arguments));

                        if (!locked) {
                            fireCallbacks();
                        }
                    }
                }
                return this;
            },
            remove: function () {
                if (callbacks) {
                    Array.from(arguments).forEach(function (arg) {
                        var index;
                        while ((index = callbacks.indexOf(arg, index)) > -1) {
                            callbacks.splice(index, 1);
                            if (index <= firingIndex) {
                                firingIndex--;
                            }
                        }
                    });
                }
                return this;
            },
            has: function (fn) {
                return fn ? callbacks.includes(fn) : callbacks.length > 0;
            },
            empty: function () {
                if (callbacks) {
                    callbacks = [];
                }
                return this;
            },
            disable: function () {
                memory = locked = callbacks = '';
                return this;
            },
            disabled: function () {
                return !callbacks;
            },
            lock: function () {
                locked = true;
                if (!memory) {
                    api.disable();
                }
                return this;
            },
            locked: function () {
                return !!locked;
            },
            fireWith: function (context, args) {
                if (!locked) {
                    args = [context, args ? args.slice() : []];
                    callbacks.push(args);
                    if (!fired) {
                        fireCallbacks();
                    }
                }
                return this;
            },
            fire: function () {
                return api.fireWith(this, arguments);
            },
            fired: function () {
                return !!fired;
            }
        };

        return api;
    };

    utils0.extend({
        Deferred: function (t) {
            var n = [
                [
                    'notify',
                    'progress',
                    utils0.Callbacks('memory'),
                    utils0.Callbacks('memory'),
                    2
                ],
                [
                    'resolve',
                    'done',
                    utils0.Callbacks('once memory'),
                    utils0.Callbacks('once memory'),
                    0,
                    'resolved'
                ],
                [
                    'reject',
                    'fail',
                    utils0.Callbacks('once memory'),
                    utils0.Callbacks('once memory'),
                    1,
                    'rejected'
                ]
            ], r = 'pending', i = {
                state: function () {
                    return r;
                },
                always: function () {
                    return o.done(arguments).fail(arguments), this;
                },
                catch: function (e) {
                    return i.then(null, e);
                },
                pipe: function () {
                    var e = arguments;
                    return utils0.Deferred(function (t) {
                        utils0.each(n, function (n, r) {
                            var i = h(e[r[4]]) && e[r[4]];
                            o[r[1]](function () {
                                var e = i && i.apply(this, arguments);
                                e && h(e.promise) ? e.promise().progress(t.notify).done(t.resolve).fail(t.reject) : t[r[0] + 'With'](this, i ? [e] : arguments);
                            });
                        });
                        e = null;
                    }).promise();
                },
                then: function (t, r, i) {
                    var o = 0;
                    function a(t, n, r, i) {
                        return function () {
                            var s = this, u = arguments, l = function () {
                                var e, l;
                                if (!(t < o)) {
                                    if ((e = r.apply(s, u)) === n.promise()) {
                                        throw new TypeError('Thenable self-resolution');
                                    }
                                    l = e && ('object' == typeof e || 'function' == typeof e) && e.then;
                                    h(l) ? i ? l.call(e, a(o, n, P, i), a(o, n, O, i)) : (o++, l.call(e, a(o, n, P, i), a(o, n, O, i), a(o, n, P, n.notifyWith))) : (r !== P && (s = void 0, u = [e]), (i || n.resolveWith)(s, u));
                                }
                            }, c = i ? l : function () {
                                try {
                                    l();
                                } catch (e) {
                                    utils0.Deferred.exceptionHook && utils0.Deferred.exceptionHook(e, c.stackTrace);
                                    t + 1 >= o && (r !== O && (s = void 0, u = [e]), n.rejectWith(s, u));
                                }
                            };
                            t ? c() : (utils0.Deferred.getStackHook && (c.stackTrace = utils0.Deferred.getStackHook()), e.setTimeout(c));
                        };
                    }
                    return utils0.Deferred(function (e) {
                        n[0][3].add(a(0, e, h(i) ? i : P, e.notifyWith));
                        n[1][3].add(a(0, e, h(t) ? t : P));
                        n[2][3].add(a(0, e, h(r) ? r : O));
                    }).promise();
                },
                promise: function (e) {
                    return null != e ? utils0.extend(e, i) : i;
                }
            }, o = { e: arguments.length > 1 ? i.call(arguments) : n };
            return utils0.each(n, function (e, t) {
                var a = t[2], s = t[5];
                i[t[1]] = a.add;
                s && a.add(function () {
                    r = s;
                }, n[3 - e][2].disable, n[3 - e][3].disable, n[0][2].lock, n[0][3].lock);
                a.add(t[3].fire);
                o[t[0]] = function () {
                    return o[t[0] + 'With'](this === o ? void 0 : this, arguments), this;
                };
                o[t[0] + 'With'] = a.fireWith;
            }), i.promise(o), t && t.call(o, o), o;
        },
        when: function (e) {
            var t = arguments.length, n = t, r = Array(n), o = i.call(arguments), a = utils0.Deferred(), s = function (e) {
                return function (n) {
                    r[e] = this;
                    ;
                    --t || a.resolveWith(r, o);
                };
            };
            if (t <= 1 && (R(e, a.done(s(n)).resolve, a.reject, !t), 'pending' === a.state() || h(o[n] && o[n].then))) {
                return a.then();
            }
            for (; n--;) {
                R(o[n], s(n), a.reject);
            }
            return a.promise();
        }
    });
    ;
    utils0.Deferred.exceptionHook = function (t, n) {
        e.console && e.console.warn && t && /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/.test(t.name) && e.console.warn('jQuery.Deferred exception: ' + t.message, t.stack, n);
    };
    utils0.readyException = function (t) {
        e.setTimeout(function () {
            throw t;
        });
    };
    var B = utils0.Deferred();
    function W() {
        y.removeEventListener('DOMContentLoaded', W);
        e.removeEventListener('load', W);
        utils0.ready();
    }
    utils0.fn.ready = function (e) {
        return B.then(e).catch(function (e) {
            utils0.readyException(e);
        }), this;
    };
    utils0.extend({
        isReady: false,
        readyWait: 1,
        ready: function (e) {
            (true === e ? --utils0.readyWait : utils0.isReady) || (utils0.isReady = true, true !== e && --utils0.readyWait > 0 || B.resolveWith(y, [utils0]));
        }
    });
    utils0.ready.then = B.then;
    'complete' === y.readyState || 'loading' !== y.readyState && !y.documentElement.doScroll ? e.setTimeout(utils0.ready) : (y.addEventListener('DOMContentLoaded', W), e.addEventListener('load', W));
    var F = function (elems, callback, key, value, iterate, context) {
        var length = elems.length,
            index = 0,
            isObject = typeof key === 'object',
            needsContext = !context;

        if (isObject) {
            for (index in key) {
                F(elems, callback, index, key[index], true, value);
            }
        } else {
            if (value !== undefined) {
                iterate = true;
                if (!utils0.isFunction(value)) {
                    context = true;
                }

                if (needsContext) {
                    if (context) {
                        callback.call(elems, value);
                        callback = null;
                    } else {
                        needsContext = callback;
                        callback = function (elem, key, value) {
                            return needsContext.call(utils0(elem), value);
                        };
                    }
                }

                if (callback) {
                    for (; index < length; index++) {
                        callback(elems[index], key, context ? value : value.call(elems[index], index, callback(elems[index], key)));
                    }
                }
            }
        }

        return iterate ? elems : needsContext ? callback.call(elems) : length ? callback(elems[0], key) : context;
    };

    function G(e, t) {
        return t.toUpperCase();
    }
    function z(e) {
        return e.replace(/^-ms-/, 'ms-').replace(/-([a-z])/g, G);
    }
    var U = function (e) {
        return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType;
    };
    function V() {
        this.expando = utils0.expando + V.uid++;
    }
    V.uid = 1;
    V.prototype = {
        cache: function (e) {
            var t = e[this.expando];
            return t || (t = {}, U(e) && (e.nodeType ? e[this.expando] = t : Object.defineProperty(e, this.expando, {
                value: t,
                configurable: true
            }))), t;
        },
        set: function (e, t, n) {
            var r, i = this.cache(e);
            if ('string' == typeof t) {
                i[z(t)] = n;
            } else {
                for (r in t)
                    i[z(r)] = t[r];
            }
            return i;
        },
        get: function (e, t) {
            return void 0 === t ? this.cache(e) : e[this.expando] && e[this.expando][z(t)];
        },
        access: function (e, t, n) {
            return void 0 === t || t && 'string' == typeof t && void 0 === n ? this.get(e, t) : (this.set(e, t, n), void 0 !== n ? n : t);
        },
        remove: function (e, t) {
            var n, r = e[this.expando];
            if (void 0 !== r) {
                if (void 0 !== t) {
                    n = (t = Array.isArray(t) ? t.map(z) : (t = z(t)) in r ? [t] : t.match(/[^\x20\t\r\n\f]+/g) || []).length;
                    for (; n--;) {
                        delete r[t[n]];
                    }
                }
                (void 0 === t || utils0.isEmptyObject(r)) && (e.nodeType ? e[this.expando] = void 0 : delete e[this.expando]);
            }
        },
        hasData: function (e) {
            var t = e[this.expando];
            return void 0 !== t && !utils0.isEmptyObject(t);
        }
    };
    var X = new V(), Y = new V();
    function K(e, t, n) {
        var r;
        if (void 0 === n && 1 === e.nodeType) {
            if (r = 'data-' + t.replace(/[A-Z]/g, '-$&').toLowerCase(), 'string' == typeof (n = e.getAttribute(r))) {
                try {
                    n = function (e) {
                        return 'true' === e || 'false' !== e && ('null' === e ? null : e === +e + '' ? +e : /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/.test(e) ? JSON.parse(e) : e);
                    }(n);
                } catch (e) {
                }
                Y.set(e, t, n);
            } else {
                n = void 0;
            }
        }
        return n;
    }
    utils0.extend({
        hasData: function (e) {
            return Y.hasData(e) || X.hasData(e);
        },
        data: function (e, t, n) {
            return Y.access(e, t, n);
        },
        removeData: function (e, t) {
            Y.remove(e, t);
        },
        _data: function (e, t, n) {
            return X.access(e, t, n);
        },
        _removeData: function (e, t) {
            X.remove(e, t);
        }
    });
    utils0.fn.extend({
        data: function (e, t) {
            var n, r, i, o = this[0], a = o && o.attributes;
            if (void 0 === e) {
                if (this.length && (i = Y.get(o), 1 === o.nodeType && !X.get(o, 'hasDataAttrs'))) {
                    for (n = a.length; n--;) {
                        a[n] && 0 === (r = a[n].name).indexOf('data-') && (r = z(r.slice(5)), K(o, r, i[r]));
                    }
                    X.set(o, 'hasDataAttrs', true);
                }
                return i;
            }
            return 'object' == typeof e ? this.each(function () {
                Y.set(this, e);
            }) : F(this, function (t) {
                var n;
                if (o && void 0 === t) {
                    return void 0 !== (n = Y.get(o, e)) ? n : void 0 !== (n = K(o, e)) ? n : void 0;
                }
                this.each(function () {
                    Y.set(this, e, t);
                });
            }, null, t, arguments.length > 1, null, true);
        },
        removeData: function (e) {
            return this.each(function () {
                Y.remove(this, e);
            });
        }
    });
    utils0.extend({
        queue: function (element, queueName, data) {
            var queue;
            if (element) {
                queueName = (queueName || 'fx') + 'queue';
                queue = X.get(element, queueName);
                if (data) {
                    if (!queue || Array.isArray(data)) {
                        queue = X.access(element, queueName, utils0.makeArray(data));
                    } else {
                        queue.push(data);
                    }
                }
                return queue || [];
            }
        },
        dequeue: function (element, queueName) {
            queueName = queueName || 'fx';
            var queue = utils0.queue(element, queueName),
                length = queue.length,
                next = queue.shift(),
                hooks = utils0._queueHooks(element, queueName);

            if (next === 'inprogress') {
                next = queue.shift();
                length--;
            }

            if (next) {
                if (queueName === 'fx' && queue[0] !== 'inprogress') {
                    queue.unshift('inprogress');
                }
                delete hooks.stop;
                next.call(element, function () {
                    utils0.dequeue(element, queueName);
                }, hooks);
            }

            if (!length && hooks) {
                hooks.empty.fire();
            }
        },
        _queueHooks: function (element, queueName) {
            var hooksKey = queueName + 'queueHooks';
            return X.get(element, hooksKey) || X.access(element, hooksKey, {
                empty: utils0.Callbacks('once memory').add(function () {
                    X.remove(element, [queueName + 'queue', hooksKey]);
                })
            });
        }
    });

    utils0.fn.extend({
        queue: function (queueName, callback) {
            var minArgsCount = 2;
            if (typeof queueName !== 'string') {
                callback = queueName;
                queueName = 'fx';
                minArgsCount--;
            }
            if (arguments.length < minArgsCount) {
                return utils0.queue(this[0], queueName);
            } else if (callback === undefined) {
                return this;
            } else {
                return this.each(function () {
                    var queue = utils0.queue(this, queueName, callback);
                    utils0._queueHooks(this, queueName);
                    if (queueName === 'fx' && queue[0] !== 'inprogress') {
                        utils0.dequeue(this, queueName);
                    }
                });
            }
        },
        dequeue: function (queueName) {
            return this.each(function () {
                utils0.dequeue(this, queueName);
            });
        },
        clearQueue: function (queueName) {
            return this.queue(queueName || 'fx', []);
        },
        promise: function (type, target) {
            var count = 1;
            var deferred = utils0.Deferred();
            var elements = this;
            var length = this.length;
            var decrement = function () {
                --count || deferred.resolveWith(elements, [elements]);
            };
            if (typeof type !== 'string') {
                target = type;
                type = undefined;
            }
            type = type || 'fx';
            for (; length--;) {
                var hooks = X.get(elements[length], type + 'queueHooks');
                if (hooks && hooks.empty) {
                    count++;
                    hooks.empty.add(decrement);
                }
            }
            decrement();
            return deferred.promise(target);
        }
    });

    var Z = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, ee = new RegExp('^(?:([+-])=|)(' + Z + ')([a-z%]*)$', 'i'), te = [
        'Top',
        'Right',
        'Bottom',
        'Left'
    ], ne = y.documentElement, re = function (e) {
        return utils0.contains(e.ownerDocument, e);
    };
    ne.getRootNode && (re = function (e) {
        return utils0.contains(e.ownerDocument, e) || e.getRootNode(ie) === e.ownerDocument;
    });
    var oe = function (e, t) {
        return 'none' === (e = t || e).style.display || '' === e.style.display && re(e) && 'none' === utils0.css(e, 'display');
    };
    function animatePropertyValue(element, property, duration, options) {
        var easing = options ? function () {
            return options.cur();
        } : function () {
            return jQuery.css(element, property, '');
        };
        var initialValue = easing();
        var unit = duration && duration[3] || (jQuery.cssNumber[property] ? '' : 'px');
        var matches = element.nodeType && (jQuery.cssNumber[property] || 'px' !== unit && +initialValue) && /([\d.]+)/g.exec(jQuery.css(element, property));

        if (matches && matches[3] !== unit) {
            var currentValue = +initialValue || 0;
            var targetValue = matches[1] ? currentValue + (matches[1] + 1) * matches[2] : +matches[2];

            if (options) {
                options.unit = unit;
                options.start = currentValue;
                options.end = targetValue;
            }

            return targetValue;
        }

        return null;
    }

    var se = {};
    function ue(e) {
        var t, n = e.ownerDocument, r = e.nodeName, i = se[r];
        return i || (t = n.body.appendChild(n.createElement(r)), i = utils0.css(t, 'display'), t.parentNode.removeChild(t), 'none' === i && (i = 'block'), se[r] = i, i);
    }
    function le(e, t) {
        for (var n, r, i = [], o = 0, a = e.length; o < a; o++) {
            (r = e[o]).style && (n = r.style.display, t ? ('none' === n && (i[o] = X.get(r, 'display') || null, i[o] || (r.style.display = '')), '' === r.style.display && oe(r) && (i[o] = ue(r))) : 'none' !== n && (i[o] = 'none', X.set(r, 'display', n)));
        }
        for (o = 0; o < a; o++) {
            null != i[o] && (e[o].style.display = i[o]);
        }
        return e;
    }
    utils0.fn.extend({
        show: function () {
            return le(this, true);
        },
        hide: function () {
            return le(this);
        },
        toggle: function (e) {
            return 'boolean' == typeof e ? e ? this.show() : this.hide() : this.each(function () {
                oe(this) ? utils0(this).show() : utils0(this).hide();
            });
        }
    });
    var ce, fe;
    ce = y.createDocumentFragment().appendChild(y.createElement('div'));
    (fe = y.createElement('input')).setAttribute('type', 'radio');
    fe.setAttribute('checked', 'checked');
    fe.setAttribute('name', 't');
    ce.appendChild(fe);
    ;
    ce.innerHTML = '<textarea>x</textarea>';
    ;
    ce.innerHTML = '<option></option>';
    ;
    var ge = {
        thead: [
            1,
            '<table>',
            '</table>'
        ],
        col: [
            2,
            '<table><colgroup>',
            '</colgroup></table>'
        ],
        tr: [
            2,
            '<table><tbody>',
            '</tbody></table>'
        ],
        td: [
            3,
            '<table><tbody><tr>',
            '</tr></tbody></table>'
        ],
        _default: [
            0,
            '',
            ''
        ]
    };
    function ye(e, t) {
        var n;
        return n = void 0 !== e.getElementsByTagName ? e.getElementsByTagName(t || '*') : void 0 !== e.querySelectorAll ? e.querySelectorAll(t || '*') : [], void 0 === t || t && A(e, t) ? utils0.merge([e], n) : n;
    }
    function ve(e, t) {
        for (var n = 0, r = e.length; n < r; n++) {
            X.set(e[n], 'globalEval', !t || X.get(t[n], 'globalEval'));
        }
    }
    ge.tbody = ge.tfoot = ge.colgroup = ge.caption = ge.thead;
    ge.th = ge.td;
    d.option || (ge.optgroup = ge.option = [
        1,
        '<select multiple=\'multiple\'>',
        '</select>'
    ]);
    ;
    function createFragmentFromHTML(htmlString, document, scripts, scriptsArray) {
        var fragment = document.createDocumentFragment();
        var nodes = [];
        var tagMatch;
        var tagName;
        var defaultWrap;

        for (var i = 0; i < htmlString.length; i++) {
            var node = htmlString[i];
            if (node || node === 0) {
                if (typeof node === 'object') {
                    // If the node is an actual DOM node, add it to the fragment
                    nodes.push(node.nodeType ? node : node);
                } else {
                    // If the node is a string
                    if (/<|&#?\w+;/.test(node)) {
                        // If the string contains HTML
                        tagMatch = (/<([a-z][^\/\0>\x20\t\r\n\f]*)/i.exec(node) || ['', ''])[1].toLowerCase();
                        defaultWrap = specialElements[tagMatch] || specialElements._default;
                        var wrapper = defaultWrap[1] + utils0.htmlPrefilter(node) + defaultWrap[2];
                        var tempDiv = document.createElement('div');
                        tempDiv.innerHTML = wrapper;
                        for (var j = defaultWrap[0]; j--;) {
                            tempDiv = tempDiv.lastChild;
                        }
                        // Add the child nodes of the wrapper to the fragment
                        nodes.push.apply(nodes, tempDiv.childNodes);
                        // Clear the temp div
                        tempDiv.textContent = '';
                    } else {
                        // If the string does not contain HTML, create a text node and add it to the fragment
                        nodes.push(document.createTextNode(node));
                    }
                }
            }
        }

        // Append nodes to the fragment
        for (var k = 0; k < nodes.length; k++) {
            var currentNode = nodes[k];
            if (scripts && utils0.inArray(currentNode, scripts) > -1) {
                if (scriptsArray) {
                    scriptsArray.push(currentNode);
                }
            } else {
                var isScript = isScriptElement(currentNode);
                var wrappedNode = wrapNode(fragment.appendChild(currentNode), 'script');
                if (isScript) {
                    handleScriptElement(wrappedNode);
                }
                if (scriptsArray && n) {
                    var scriptNodes = wrappedNode.childNodes;
                    for (var m = 0; m < scriptNodes.length; m++) {
                        var currentScriptNode = scriptNodes[m];
                        if (/^$|^module$|\/(?:java|ecma)script/i.test(currentScriptNode.type || '')) {
                            scriptsArray.push(currentScriptNode);
                        }
                    }
                }
            }
        }

        return fragment;
    }

    function returnTrue() {
        return true;
    }
    function returnFalse() {
        return false;
    }
    function Te(e, t) {
        return e === function () {
            try {
                return y.activeElement;
            } catch (e) {
            }
        }() == ('focus' === t);
    }


    function bindEventHandler(element, eventType, handlerFunction) {
        if (handlerFunction) {
            X.set(element, eventType, false);
            utils0.event.add(element, eventType, {
                namespace: false,
                handler: function (event) {
                    var args, prevArgs, storedArgs = X.get(this, eventType);

                    if (event.isTrigger & 1 && this[eventType]) {
                        if (storedArgs.length) {
                            (utils0.event.special[eventType] || {}).delegateType && event.stopPropagation();
                        } else {
                            if (storedArgs = Array.prototype.slice.call(arguments), X.set(this, eventType, storedArgs), args = handlerFunction(this, eventType), this[eventType](), storedArgs !== (prevArgs = X.get(this, eventType)) || args) {
                                return event.stopImmediatePropagation(), event.preventDefault(), prevArgs && prevArgs.value;
                            }
                        }
                    } else {
                        storedArgs.length && (X.set(this, eventType, { value: utils0.event.trigger(utils0.extend(storedArgs[0], utils0.Event.prototype), storedArgs.slice(1), this) }), event.stopImmediatePropagation());
                    }
                }
            });
        } else {
            void 0 === X.get(element, eventType) && utils0.event.add(element, eventType, returnTrue);
        }
    }

    utils0.event = {
        global: {},
        add: function (element, eventTypes, handler, data, selector) {
            var eventType, match, eventObj, events, handle;

            if (U(element)) {
                // Normalize handler and selector
                if (handler && !handler.guid) {
                    handler = (eventObj = handler).handler;
                    selector = eventObj.selector;
                }

                selector && utils0.find.matchesSelector(ne, selector);

                handler.guid || (handler.guid = utils0.guid++);

                events = (match = X.get(element)).events || (match.events = Object.create(null));
                handle = match.handle || (match.handle = function (event) {
                    return void 0 !== utils0 && utils0.event.triggered !== event.type ? utils0.event.dispatch.apply(element, arguments) : void 0;
                });

                for (var i = (eventTypes = (eventTypes || '').match(/[^\x20\t\r\n\f]+/g) || []).length; i--;) {
                    var parts = /^([^.]*)(?:\.(.+)|)/.exec(eventTypes[i]) || [];
                    var eventType = parts[1];
                    var namespaces = (parts[2] || '').split('.').sort();

                    if (eventType) {
                        eventObj = utils0.event.special[eventType] || {};
                        eventType = (selector ? eventObj.delegateType : eventObj.bindType) || eventType;
                        eventObj = utils0.event.special[eventType] || {};

                        match = utils0.extend({
                            type: eventType,
                            origType: parts[1],
                            data: data,
                            handler: handler,
                            guid: handler.guid,
                            selector: selector,
                            needsContext: selector && utils0.expr.match.needsContext.test(selector),
                            namespace: namespaces.join('.')
                        }, eventObj);

                        (handlers = events[eventType]) || ((handlers = events[eventType] = []).delegateCount = 0,
                            eventObj.setup && false !== eventObj.setup.call(element, data, namespaces, handle) || element.addEventListener && element.addEventListener(eventType, handle));

                        if (eventObj.add) {
                            eventObj.add.call(element, match);
                            match.handler.guid || (match.handler.guid = handler.guid);
                        }

                        selector ? handlers.splice(handlers.delegateCount++, 0, match) : handlers.push(match);

                        utils0.event.global[eventType] = true;
                    }
                }
            }
        },
        remove: function (element, eventTypes, handler, selector, mappedTypes) {
            var eventType, match, eventObj, events, handle;

            if ((match = X.hasData(element)) && (events = match.events)) {
                for (var i = (eventTypes = (eventTypes || '').match(/[^\x20\t\r\n\f]+/g) || []).length; i--;) {
                    if (eventType = /^([^.]*)(?:\.(.+)|)/.exec(eventTypes[i]) || [], eventNamespace = (eventType[2] || '').split('.').sort(), eventType = eventType[1]) {
                        if (!mappedTypes) {
                            for (var j = eventNamespace.length; j--;) {
                                eventNamespaceRegex = eventNamespace[2] && new RegExp('(^|\\.)' + eventNamespace.join('\\.(?:.*\\.|)') + '(\\.|$)');
                            }
                        }

                        eventObj = utils0.event.special[eventType] || {};
                        eventTypes = (selector ? eventObj.delegateType : eventObj.bindType) || eventType;
                        eventTypes = (selector ? eventObj.delegateType : eventObj.bindType) || eventType;

                        if (handlers = (handlers = events[eventTypes] || []).slice(0), eventType = eventType && new RegExp('(^|\\.)' + eventNamespace.join('\\.(?:.*\\.|)') + '(\\.|$)'), match = match[2] && new RegExp('(^|\\.)' + eventNamespace.join('\\.(?:.*\\.|)') + '(\\.|$)'), eventType || mappedTypes || selector || "**" === selector) {
                            for (var j = 0, handler; handler = handlers[j++];) {
                                if ((!mappedTypes && eventNamespace) || selector !== handler.selector || eventType && !eventType.test(handler.namespace) || selector && "**" !== selector && selector !== handler.selector) {
                                    handlers.splice(j--, 1);
                                    handler.selector && handlers.delegateCount--;
                                    eventObj.remove && eventObj.remove.call(element, handler);
                                }
                            }
                        }
                    }
                }
                utils0.isEmptyObject(events) && X.remove(element, 'handle events');
            }
        },
        dispatch: function (event) {
            var handlers, set, ret, matchedHandlers, handler, handleObj, matchedSet,
                args = new Array(arguments.length),
                eventObject = utils0.event.fix(event),
                handlers = (set = (X.get(this, 'events') || Object.create(null))[eventObject.type] || []).slice(),
                special = utils0.event.special[eventObject.type] || {};

            for (args[0] = eventObject, i = 1; i < arguments.length; i++) {
                args[i] = arguments[i];
            }

            eventObject.delegateTarget = this;

            if (!special.preDispatch || false !== special.preDispatch.call(this, eventObject)) {
                for (matchedHandlers = utils0.event.handlers.call(this, eventObject, handlers), i = 0; handler = matchedHandlers[i++];) {
                    eventObject.currentTarget = handler.elem;

                    for (var j = 0; handleObj = handler.handlers[j++];) {
                        if (!eventObject.isPropagationStopped()) {
                            eventObject.rnamespace && false !== handleObj.namespace && !eventObject.rnamespace.test(handleObj.namespace) || (
                                eventObject.handleObj = handleObj,
                                eventObject.data = handleObj.data,
                                void 0 !== (ret = ((utils0.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(handler.elem, args)) && false === (eventObject.result = ret) && (eventObject.preventDefault(), eventObject.stopPropagation())
                            );
                        }
                    }
                }

                return special.postDispatch && special.postDispatch.call(this, eventObject), eventObject.result;
            }
        },
        handlers: function (eventObject, handlers) {
            var matchedHandlers, matchedSet, handler, matchedHandlers,
                handlers = handlers.delegateCount,
                elements = eventObject.target;

            if (handlers && elements.nodeType && !('click' === eventObject.type && eventObject.button >= 1)) {
                for (; elements !== this; elements = elements.parentNode || this) {
                    if (1 === elements.nodeType && ('click' !== eventObject.type || true !== elements.disabled)) {
                        for (var handlerQueue = [], eventMatches = {}, i = 0; i < handlers; i++) {
                            if (void 0 === eventMatches[handler = (matchedHandlers = handlers[i]).selector + ' ']) {
                                eventMatches[handler] = matchedHandlers.needsContext ? utils0(handler, this).index(elements) > -1 : utils0.find(handler, this, null, [elements]).length;
                            }
                            eventMatches[handler] && handlerQueue.push(matchedHandlers);
                        }
                        handlerQueue.length && matchedHandlers.push({
                            elem: elements,
                            handlers: handlerQueue
                        });
                    }
                }
            }

            return elements = this, handlers < handlers.length && matchedHandlers.push({
                elem: elements,
                handlers: handlers.slice(handlers)
            }), matchedHandlers;
        },
        addProp: function (name, hook) {
            Object.defineProperty(utils0.Event.prototype, name, {
                enumerable: true,
                configurable: true,
                get: h(hook) ? function () {
                    if (this.originalEvent) {
                        return hook(this.originalEvent);
                    }
                } : function () {
                    if (this.originalEvent) {
                        return this.originalEvent[name];
                    }
                },
                set: function (value) {
                    Object.defineProperty(this, name, {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: value
                    });
                }
            });
        },
        fix: function (event) {
            return event[utils0.expando] ? event : new utils0.Event(event);
        },
        special: {
            load: {
                noBubble: true
            },
            click: {
                setup: function (element) {
                    var type = this || element;
                    return /^(?:checkbox|radio)$/i.test(type.type) && type.click && A(type, 'input') && bindEventHandler(type, 'click', returnTrue), false;
                },
                trigger: function (element) {
                    var type = this || element;
                    return /^(?:checkbox|radio)$/i.test(type.type) && type.click && A(type, 'input') && bindEventHandler(type, 'click'), true;
                },
                _default: function (event) {
                    var target = event.target;
                    return /^(?:checkbox|radio)$/i.test(target.type) && target.click && A(target, 'input') && X.get(target, 'click') || A(target, 'a');
                }
            },
            beforeunload: {
                postDispatch: function (event) {
                    void 0 !== event.result && event.originalEvent && (event.originalEvent.returnValue = event.result);
                }
            }
        }
    };

    utils0.removeEvent = function (e, t, n) {
        e.removeEventListener && e.removeEventListener(t, n);
    };
    utils0.Event = function (e, t) {
        if (!(this instanceof utils0.Event)) {
            return new utils0.Event(e, t);
        }
        e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && false === e.returnValue ? returnTrue : returnFalse, this.target = e.target && 3 === e.target.nodeType ? e.target.parentNode : e.target, this.currentTarget = e.currentTarget, this.relatedTarget = e.relatedTarget) : this.type = e;
        t && utils0.extend(this, t);
        this.timeStamp = e && e.timeStamp || Date.now();
        this[utils0.expando] = true;
    };
    utils0.Event.prototype = {
        constructor: utils0.Event,
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse,
        isSimulated: false,
        preventDefault: function () {
            var e = this.originalEvent;
            this.isDefaultPrevented = returnTrue;
            e && !this.isSimulated && e.preventDefault();
        },
        stopPropagation: function () {
            var e = this.originalEvent;
            this.isPropagationStopped = returnTrue;
            e && !this.isSimulated && e.stopPropagation();
        },
        stopImmediatePropagation: function () {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = returnTrue;
            e && !this.isSimulated && e.stopImmediatePropagation();
            this.stopPropagation();
        }
    };
    utils0.each({
        altKey: true,
        bubbles: true,
        cancelable: true,
        changedTouches: true,
        ctrlKey: true,
        detail: true,
        eventPhase: true,
        metaKey: true,
        pageX: true,
        pageY: true,
        shiftKey: true,
        view: true,
        char: true,
        code: true,
        charCode: true,
        key: true,
        keyCode: true,
        button: true,
        buttons: true,
        clientX: true,
        clientY: true,
        offsetX: true,
        offsetY: true,
        pointerId: true,
        pointerType: true,
        screenX: true,
        screenY: true,
        targetTouches: true,
        toElement: true,
        touches: true,
        which: true
    }, utils0.event.addProp);
    utils0.each({
        focus: 'focusin',
        blur: 'focusout'
    }, function (e, t) {
        utils0.event.special[e] = {
            setup: function () {
                return bindEventHandler(this, e, Te), false;
            },
            trigger: function () {
                return bindEventHandler(this, e), true;
            },
            _default: function () {
                return true;
            },
            delegateType: t
        };
    });
    utils0.each({
        mouseenter: 'mouseover',
        mouseleave: 'mouseout',
        pointerenter: 'pointerover',
        pointerleave: 'pointerout'
    }, function (e, t) {
        utils0.event.special[e] = {
            delegateType: t,
            bindType: t,
            handle: function (e) {
                var n, r = e.relatedTarget, i = e.handleObj;
                return r && (r === this || utils0.contains(this, r)) || (e.type = i.origType, n = i.handler.apply(this, arguments), e.type = t), n;
            }
        };
    });
    utils0.fn.extend({
        on: function (e, t, n, r) {
            return bindEvents(this, e, t, n, r);
        },
        one: function (e, t, n, r) {
            return bindEvents(this, e, t, n, r, 1);
        },
        off: function (e, t, n) {
            var r, i;
            if (e && e.preventDefault && e.handleObj) {
                return r = e.handleObj, utils0(e.delegateTarget).off(r.namespace ? r.origType + '.' + r.namespace : r.origType, r.selector, r.handler), this;
            }
            if ('object' == typeof e) {
                for (i in e)
                    this.off(i, t, e[i]);
                return this;
            }
            return false !== t && 'function' != typeof t || (n = t, t = void 0), false === n && (n = returnFalse), this.each(function () {
                utils0.event.remove(this, e, n, t);
            });
        }
    });
    ;
    function De(e, t) {
        return A(e, 'table') && A(11 !== t.nodeType ? t : t.firstChild, 'tr') && utils0(e).children('tbody')[0] || e;
    }
    function Ne(e) {
        return e.type = (null !== e.getAttribute('type')) + '/' + e.type, e;
    }
    function Le(e) {
        return 'true/' === (e.type || '').slice(0, 5) ? e.type = e.type.slice(5) : e.removeAttribute('type'), e;
    }
    function qe(e, t) {
        var n, r, i, o, a, s;
        if (1 === t.nodeType) {
            if (X.hasData(e) && (s = X.get(e).events)) {
                for (i in (X.remove(t, 'handle events'), s))
                    for (n = 0, r = s[i].length; n < r; n++) {
                        utils0.event.add(t, i, s[i][n]);
                    }
            }
            Y.hasData(e) && (o = Y.access(e), a = utils0.extend({}, o), Y.set(t, a));
        }
    }
    function He(e, t, n, r) {
        t = o(t);
        var i, a, s, u, l, c, f = 0, p = e.length, g = p - 1, y = t[0], v = h(y);
        if (v || p > 1 && 'string' == typeof y && !d.checkClone && /checked\s*(?:[^=]|=\s*.checked.)/i.test(y)) {
            return e.each(function (i) {
                var o = e.eq(i);
                v && (t[0] = y.call(this, i, o.html()));
                He(o, t, n, r);
            });
        }
        if (p && (a = (i = createFragmentFromHTML(t, e[0].ownerDocument, false, e, r)).firstChild, 1 === i.childNodes.length && (i = a), a || r)) {
            for (u = (s = utils0.map(ye(i, 'script'), Ne)).length; f < p; f++) {
                l = i;
                f !== g && (l = utils0.clone(l, true, true), u && utils0.merge(s, ye(l, 'script')));
                n.call(e[f], l, f);
            }
            if (u) {
                for (c = s[s.length - 1].ownerDocument, utils0.map(s, Le), f = 0; f < u; f++) {
                    l = s[f];
                    /^$|^module$|\/(?:java|ecma)script/i.test(l.type || '') && !X.access(l, 'globalEval') && utils0.contains(c, l) && (l.src && 'module' !== (l.type || '').toLowerCase() ? utils0._evalUrl && !l.noModule && utils0._evalUrl(l.src, { nonce: l.nonce || l.getAttribute('nonce') }, c) : m(l.textContent.replace(/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, ''), l, c));
                }
            }
        }
        return e;
    }
    function Me(e, t, n) {
        for (var r, i = t ? utils0.filter(t, e) : e, o = 0; null != (r = i[o]); o++) {
            n || 1 !== r.nodeType || utils0.cleanData(ye(r));
            r.parentNode && (n && re(r) && ve(ye(r, 'script')), r.parentNode.removeChild(r));
        }
        return e;
    }
    utils0.extend({
        htmlPrefilter: function (e) {
            return e;
        },
        clone: function (e, t, n) {
            var r, i, o, a, s, u, l, c = e.cloneNode(true), f = re(e);
            if (!(d.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || utils0.isXMLDoc(e))) {
                for (a = ye(c), r = 0, i = (o = ye(e)).length; r < i; r++) {
                    s = o[r];
                    u = a[r];
                    void 0;
                    'input' === (l = u.nodeName.toLowerCase()) && /^(?:checkbox|radio)$/i.test(s.type) ? u.checked = s.checked : 'input' !== l && 'textarea' !== l || (u.defaultValue = s.defaultValue);
                }
            }
            if (t) {
                if (n) {
                    for (o = o || ye(e), a = a || ye(c), r = 0, i = o.length; r < i; r++) {
                        qe(o[r], a[r]);
                    }
                } else {
                    qe(e, c);
                }
            }
            return (a = ye(c, 'script')).length > 0 && ve(a, !f && ye(e, 'script')), c;
        },
        cleanData: function (e) {
            for (var t, n, r, i = utils0.event.special, o = 0; void 0 !== (n = e[o]); o++) {
                if (U(n)) {
                    if (t = n[X.expando]) {
                        if (t.events) {
                            for (r in t.events)
                                i[r] ? utils0.event.remove(n, r) : utils0.removeEvent(n, r, t.handle);
                        }
                        n[X.expando] = void 0;
                    }
                    n[Y.expando] && (n[Y.expando] = void 0);
                }
            }
        }
    });
    utils0.fn.extend({
        detach: function (e) {
            return Me(this, e, true);
        },
        remove: function (e) {
            return Me(this, e);
        },
        text: function (e) {
            return F(this, function (e) {
                return void 0 === e ? utils0.text(this) : this.empty().each(function () {
                    1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = e);
                });
            }, null, e, arguments.length);
        },
        append: function () {
            return He(this, arguments, function (e) {
                1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || De(this, e).appendChild(e);
            });
        },
        prepend: function () {
            return He(this, arguments, function (e) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = De(this, e);
                    t.insertBefore(e, t.firstChild);
                }
            });
        },
        before: function () {
            return He(this, arguments, function (e) {
                this.parentNode && this.parentNode.insertBefore(e, this);
            });
        },
        after: function () {
            return He(this, arguments, function (e) {
                this.parentNode && this.parentNode.insertBefore(e, this.nextSibling);
            });
        },
        empty: function () {
            for (var e, t = 0; null != (e = this[t]); t++) {
                1 === e.nodeType && (utils0.cleanData(ye(e, false)), e.textContent = '');
            }
            return this;
        },
        clone: function (e, t) {
            return e = null != e && e, t = null == t ? e : t, this.map(function () {
                return utils0.clone(this, e, t);
            });
        },
        html: function (e) {
            return F(this, function (e) {
                var t = this[0] || {}, n = 0, r = this.length;
                if (void 0 === e && 1 === t.nodeType) {
                    return t.innerHTML;
                }
                if ('string' == typeof e && !/<script|<style|<link/i.test(e) && !ge[(/<([a-z][^\/\0>\x20\t\r\n\f]*)/i.exec(e) || [
                    '',
                    ''
                ])[1].toLowerCase()]) {
                    e = utils0.htmlPrefilter(e);
                    try {
                        for (; n < r; n++) {
                            1 === (t = this[n] || {}).nodeType && (utils0.cleanData(ye(t, false)), t.innerHTML = e);
                        }
                        t = 0;
                    } catch (e) {
                    }
                }
                t && this.empty().append(e);
            }, null, e, arguments.length);
        },
        replaceWith: function () {
            var e = [];
            return He(this, arguments, function (t) {
                var n = this.parentNode;
                utils0.inArray(this, e) < 0 && (utils0.cleanData(ye(this)), n && n.replaceChild(t, this));
            }, e);
        }
    });
    utils0.each({
        appendTo: 'append',
        prependTo: 'prepend',
        insertBefore: 'before',
        insertAfter: 'after',
        replaceAll: 'replaceWith'
    }, function (e, t) {
        utils0.fn[e] = function (e) {
            for (var n, r = [], i = utils0(e), o = i.length - 1, s = 0; s <= o; s++) {
                n = s === o ? this : this.clone(true);
                utils0(i[s])[t](n);
                a.apply(r, n.get());
            }
            return this.pushStack(r);
        };
    });
    var Pe = new RegExp('^(' + Z + ')(?!px)[a-z%]+$', 'i'), Oe = function (t) {
        var n = t.ownerDocument.defaultView;
        return n && n.opener || (n = e), n.getComputedStyle(t);
    }, Re = function (e, t, n) {
        var r, i, o = {};
        for (i in t)
            o[i] = e.style[i], e.style[i] = t[i];
        for (i in (r = n.call(e), t))
            e.style[i] = o[i];
        return r;
    }, Ie = new RegExp(te.join('|'), 'i');
    function Be(e, t, n) {
        var r, i, o, a, s = e.style;
        return (n = n || Oe(e)) && ('' !== (a = n.getPropertyValue(t) || n[t]) || re(e) || (a = utils0.style(e, t)), !d.pixelBoxStyles() && Pe.test(a) && Ie.test(t) && (r = s.width, i = s.minWidth, o = s.maxWidth, s.minWidth = s.maxWidth = s.width = a, a = n.width, s.width = r, s.minWidth = i, s.maxWidth = o)), void 0 !== a ? a + '' : a;
    }
    function We(e, t) {
        return {
            get: function () {
                if (!e()) {
                    return (this.get = t).apply(this, arguments);
                }
                delete this.get;
            }
        };
    }
    !function () {
        function t() {
            if (c) {
                l.style.cssText = 'position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0';
                c.style.cssText = 'position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%';
                ne.appendChild(l).appendChild(c);
                var t = e.getComputedStyle(c);
                r = '1%' !== t.top;
                u = 12 === n(t.marginLeft);
                c.style.right = '60%';
                a = 36 === n(t.right);
                i = 36 === n(t.width);
                c.style.position = 'absolute';
                o = 12 === n(c.offsetWidth / 3);
                ne.removeChild(l);
                c = null;
            }
        }
        function n(e) {
            return Math.round(parseFloat(e));
        }
        var r, i, o, a, s, u, l = y.createElement('div'), c = y.createElement('div');
        c.style && (c.style.backgroundClip = 'content-box', c.cloneNode(true).style.backgroundClip = '', d.clearCloneStyle = 'content-box' === c.style.backgroundClip, utils0.extend(d, {
            boxSizingReliable: function () {
                return t(), i;
            },
            pixelBoxStyles: function () {
                return t(), a;
            },
            pixelPosition: function () {
                return t(), r;
            },
            reliableMarginLeft: function () {
                return t(), u;
            },
            scrollboxSize: function () {
                return t(), o;
            },
            reliableTrDimensions: function () {
                var t, n, r, i;
                return null == s && (t = y.createElement('table'), n = y.createElement('tr'), r = y.createElement('div'), t.style.cssText = 'position:absolute;left:-11111px;border-collapse:separate', n.style.cssText = 'border:1px solid', n.style.height = '1px', r.style.height = '9px', r.style.display = 'block', ne.appendChild(t).appendChild(n).appendChild(r), i = e.getComputedStyle(n), s = parseInt(i.height, 10) + parseInt(i.borderTopWidth, 10) + parseInt(i.borderBottomWidth, 10) === n.offsetHeight, ne.removeChild(t)), s;
            }
        }));
    }();
    var Fe = [
        'Webkit',
        'Moz',
        'ms'
    ], $e = y.createElement('div').style, _e = {};
    function Ge(e) {
        var t = utils0.cssProps[e] || _e[e];
        return t || (e in $e ? e : _e[e] = function (e) {
            for (var t = e[0].toUpperCase() + e.slice(1), n = Fe.length; n--;) {
                if ((e = Fe[n] + t) in $e) {
                    return e;
                }
            }
        }(e) || e);
    }
    ;
    function Ye(e, t, n) {
        var r = ee.exec(t);
        return r ? Math.max(0, r[2] - (n || 0)) + (r[3] || 'px') : t;
    }
    function Qe(e, t, n, r, i, o) {
        var a = 'width' === t ? 1 : 0, s = 0, u = 0;
        if (n === (r ? 'border' : 'content')) {
            return 0;
        }
        for (; a < 4; a += 2) {
            'margin' === n && (u += utils0.css(e, n + te[a], true, i));
            r ? ('content' === n && (u -= utils0.css(e, 'padding' + te[a], true, i)), 'margin' !== n && (u -= utils0.css(e, 'border' + te[a] + 'Width', true, i))) : (u += utils0.css(e, 'padding' + te[a], true, i), 'padding' !== n ? u += utils0.css(e, 'border' + te[a] + 'Width', true, i) : s += utils0.css(e, 'border' + te[a] + 'Width', true, i));
        }
        return !r && o >= 0 && (u += Math.max(0, Math.ceil(e['offset' + t[0].toUpperCase() + t.slice(1)] - o - u - s - 0.5)) || 0), u;
    }
    function Je(e, t, n) {
        var r = Oe(e), i = (!d.boxSizingReliable() || n) && 'border-box' === utils0.css(e, 'boxSizing', false, r), o = i, a = Be(e, t, r), s = 'offset' + t[0].toUpperCase() + t.slice(1);
        if (Pe.test(a)) {
            if (!n) {
                return a;
            }
            a = 'auto';
        }
        return (!d.boxSizingReliable() && i || !d.reliableTrDimensions() && A(e, 'tr') || 'auto' === a || !parseFloat(a) && 'inline' === utils0.css(e, 'display', false, r)) && e.getClientRects().length && (i = 'border-box' === utils0.css(e, 'boxSizing', false, r), (o = s in e) && (a = e[s])), (a = parseFloat(a) || 0) + Qe(e, t, n || (i ? 'border' : 'content'), o, r, a) + 'px';
    }
    function Ke(e, t, n, r, i) {
        return new Ke.prototype.init(e, t, n, r, i);
    }
    utils0.extend({
        cssHooks: {
            opacity: {
                get: function (e, t) {
                    if (t) {
                        var n = Be(e, 'opacity');
                        return '' === n ? '1' : n;
                    }
                }
            }
        },
        cssNumber: {
            animationIterationCount: true,
            columnCount: true,
            fillOpacity: true,
            flexGrow: true,
            flexShrink: true,
            fontWeight: true,
            gridArea: true,
            gridColumn: true,
            gridColumnEnd: true,
            gridColumnStart: true,
            gridRow: true,
            gridRowEnd: true,
            gridRowStart: true,
            lineHeight: true,
            opacity: true,
            order: true,
            orphans: true,
            widows: true,
            zIndex: true,
            zoom: true
        },
        cssProps: {},
        // Define function 'style' to manipulate styles of an element
        style: function (element, styleName, value, extra) {
            // Skip text and comment nodes and check if element has style property
            if (element && element.nodeType !== 3 && element.nodeType !== 8 && element.style) {
                var match, typeOfValue, hook, camelStyleName = z(styleName),
                    isCustomProp = /^--/.test(styleName),
                    style = element.style;

                // Convert style name to proper format unless it's a custom CSS property
                if (!isCustomProp) {
                    styleName = Ge(camelStyleName);
                }

                // Get the appropriate hook if one exists
                hook = utils0.cssHooks[styleName] || utils0.cssHooks[camelStyleName];

                // If no value is provided, return the current style value
                if (value === undefined) {
                    if (hook && 'get' in hook && (match = hook.get(element, false, extra)) !== undefined) {
                        return match;
                    }
                    return style[styleName];
                }

                // Determine the type of the provided value
                typeOfValue = typeof value;

                // Handle string values and animation property values
                if (typeOfValue === 'string' && (match = ee.exec(value)) && match[1]) {
                    value = animatePropertyValue(element, styleName, match);
                    typeOfValue = 'number';
                }

                // Only process non-null and non-NaN values
                if (value != null && value === value) {
                    // If value is a number and not a custom property, potentially add units (px)
                    if (typeOfValue !== 'number' || isCustomProp) {
                        if (!isCustomProp) {
                            value += match && match[3] || (utils0.cssNumber[camelStyleName] ? '' : 'px');
                        }
                    }

                    // Avoid setting a style if it's not needed
                    if (!d.clearCloneStyle && value === '' && styleName.indexOf('background') === 0) {
                        style[styleName] = 'inherit';
                    }

                    // Use the hook's set method if available
                    if (hook && 'set' in hook && (value = hook.set(element, value, extra)) === undefined) {
                        if (isCustomProp) {
                            // Set custom property
                            style.setProperty(styleName, value);
                        } else {
                            // Set regular property
                            style[styleName] = value;
                        }
                    }
                }
            }
        },
        css: function (e, t, n, r) {
            var i, o, a, s = z(t);
            return /^--/.test(t) || (t = Ge(s)), (a = utils0.cssHooks[t] || utils0.cssHooks[s]) && 'get' in a && (i = a.get(e, true, n)), void 0 === i && (i = Be(e, t, r)), 'normal' === i && t in Xe && (i = Xe[t]), '' === n || n ? (o = parseFloat(i), true === n || isFinite(o) ? o || 0 : i) : i;
        }
    });
    utils0.each([
        'height',
        'width'
    ], function (e, t) {
        utils0.cssHooks[t] = {
            get: function (e, n, r) {
                if (n) {
                    return !/^(none|table(?!-c[ea]).+)/.test(utils0.css(e, 'display')) || e.getClientRects().length && e.getBoundingClientRect().width ? Je(e, t, r) : Re(e, Ve, function () {
                        return Je(e, t, r);
                    });
                }
            },
            set: function (e, n, r) {
                var i, o = Oe(e), a = !d.scrollboxSize() && 'absolute' === o.position, s = (a || r) && 'border-box' === utils0.css(e, 'boxSizing', false, o), u = r ? Qe(e, t, r, s, o) : 0;
                return s && a && (u -= Math.ceil(e['offset' + t[0].toUpperCase() + t.slice(1)] - parseFloat(o[t]) - Qe(e, t, 'border', false, o) - 0.5)), u && (i = ee.exec(n)) && 'px' !== (i[3] || 'px') && (e.style[t] = n, n = utils0.css(e, t)), Ye(0, n, u);
            }
        };
    });
    utils0.cssHooks.marginLeft = We(d.reliableMarginLeft, function (e, t) {
        if (t) {
            return (parseFloat(Be(e, 'marginLeft')) || e.getBoundingClientRect().left - Re(e, { marginLeft: 0 }, function () {
                return e.getBoundingClientRect().left;
            })) + 'px';
        }
    });
    utils0.each({
        margin: '',
        padding: '',
        border: 'Width'
    }, function (e, t) {
        utils0.cssHooks[e + t] = {
            expand: function (n) {
                for (var r = 0, i = {}, o = 'string' == typeof n ? n.split(' ') : [n]; r < 4; r++) {
                    i[e + te[r] + t] = o[r] || o[r - 2] || o[0];
                }
                return i;
            }
        };
        'margin' !== e && (utils0.cssHooks[e + t].set = Ye);
    });
    utils0.fn.extend({
        css: function (e, t) {
            return F(this, function (e, t, n) {
                var r, i, o = {}, a = 0;
                if (Array.isArray(t)) {
                    for (r = Oe(e), i = t.length; a < i; a++) {
                        o[t[a]] = utils0.css(e, t[a], false, r);
                    }
                    return o;
                }
                return void 0 !== n ? utils0.style(e, t, n) : utils0.css(e, t);
            }, e, t, arguments.length > 1);
        }
    });
    utils0.Tween = Ke;
    Ke.prototype = {
        constructor: Ke,
        init: function (e, t, n, r, i, o) {
            this.elem = e;
            this.prop = n;
            this.easing = i || utils0.easing._default;
            this.options = t;
            this.start = this.now = this.cur();
            this.end = r;
            this.unit = o || (utils0.cssNumber[n] ? '' : 'px');
        },
        cur: function () {
            var e = Ke.propHooks[this.prop];
            return e && e.get ? e.get(this) : Ke.propHooks._default.get(this);
        },
        run: function (e) {
            var t, n = Ke.propHooks[this.prop];
            return this.options.duration ? this.pos = t = utils0.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : Ke.propHooks._default.set(this), this;
        }
    };
    Ke.prototype.init.prototype = Ke.prototype;
    Ke.propHooks = {
        _default: {
            get: function (e) {
                var t;
                return 1 !== e.elem.nodeType || null != e.elem[e.prop] && null == e.elem.style[e.prop] ? e.elem[e.prop] : (t = utils0.css(e.elem, e.prop, '')) && 'auto' !== t ? t : 0;
            },
            set: function (e) {
                utils0.fx.step[e.prop] ? utils0.fx.step[e.prop](e) : 1 !== e.elem.nodeType || !utils0.cssHooks[e.prop] && null == e.elem.style[Ge(e.prop)] ? e.elem[e.prop] = e.now : utils0.style(e.elem, e.prop, e.now + e.unit);
            }
        }
    };
    Ke.propHooks.scrollTop = Ke.propHooks.scrollLeft = {
        set: function (e) {
            e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now);
        }
    };
    utils0.easing = {
        linear: function (e) {
            return e;
        },
        swing: function (e) {
            return 0.5 - Math.cos(e * Math.PI) / 2;
        },
        _default: 'swing'
    };
    utils0.fx = Ke.prototype.init;
    utils0.fx.step = {};
    var Ze, et;
    function rt() {
        et && (false === y.hidden && e.requestAnimationFrame ? e.requestAnimationFrame(rt) : e.setTimeout(rt, utils0.fx.interval), utils0.fx.tick());
    }


    function applyCustomTweener(properties, tweenType, context) {
        var tweenerFunction,
            tweenersArray = (customTweeners[tweenType] || []).concat(customTweeners['*']),
            index = 0,
            numberOfTweeners = tweenersArray.length;

        // Iterate over tweener functions to find a suitable one
        for (; index < numberOfTweeners; index++) {
            // Call the tweener function with context and check if it returns a truthy value
            tweenerFunction = tweenersArray[index].call(context, tweenType, properties);
            // If a tweener function returns a result, return it immediately
            if (tweenerFunction) {
                return tweenerFunction;
            }
        }
    }
    function st(e, t, n) {
        var r, i, o = 0, a = st.prefilters.length, s = utils0.Deferred().always(function () {
            delete u.elem;
        }), u = function () {
            if (i) {
                return false;
            }
            for (var t = Ze || setCurrentTimeAsTimeout(), n = Math.max(0, l.startTime + l.duration - t), r = 1 - (n / l.duration || 0), o = 0, a = l.tweens.length; o < a; o++) {
                l.tweens[o].run(r);
            }
            return s.notifyWith(e, [
                l,
                r,
                n
            ]), r < 1 && a ? n : (a || s.notifyWith(e, [
                l,
                1,
                0
            ]), s.resolveWith(e, [l]), false);
        }, l = s.promise({
            elem: e,
            props: utils0.extend({}, t),
            opts: utils0.extend(true, {
                specialEasing: {},
                easing: utils0.easing._default
            }, n),
            originalProperties: t,
            originalOptions: n,
            startTime: Ze || setCurrentTimeAsTimeout(),
            duration: n.duration,
            tweens: [],
            createTween: function (t, n) {
                var r = utils0.Tween(e, l.opts, t, n, l.opts.specialEasing[t] || l.opts.easing);
                return l.tweens.push(r), r;
            },
            stop: function (t) {
                var n = 0, r = t ? l.tweens.length : 0;
                if (i) {
                    return this;
                }
                for (i = true; n < r; n++) {
                    l.tweens[n].run(1);
                }
                return t ? (s.notifyWith(e, [
                    l,
                    1,
                    0
                ]), s.resolveWith(e, [
                    l,
                    t
                ])) : s.rejectWith(e, [
                    l,
                    t
                ]), this;
            }
        }), c = l.props;
        for (!function (e, t) {
            var n, r, i, o, a;
            for (n in e)
                if (i = t[r = z(n)], o = e[n], Array.isArray(o) && (i = o[1], o = e[n] = o[0]), n !== r && (e[r] = o, delete e[n]), (a = utils0.cssHooks[r]) && 'expand' in a) {
                    for (n in (o = a.expand(o), delete e[r], o))
                        n in e || (e[n] = o[n], t[n] = i);
                } else {
                    t[r] = i;
                }
        }(c, l.opts.specialEasing); o < a; o++) {
            if (r = st.prefilters[o].call(l, e, c, l.opts)) {
                return h(r.stop) && (utils0._queueHooks(l.elem, l.opts.queue).stop = r.stop.bind(r)), r;
            }
        }
        return utils0.map(c, applyCustomTweener, l), h(l.opts.start) && l.opts.start.call(e, l), l.progress(l.opts.progress).done(l.opts.done, l.opts.complete).fail(l.opts.fail).always(l.opts.always), utils0.fx.timer(utils0.extend(u, {
            elem: e,
            anim: l,
            queue: l.opts.queue
        })), l;
    }
    utils0.Animation = utils0.extend(st, {
        tweeners: {
            '*': [function (e, t) {
                var n = this.createTween(e, t);
                return animatePropertyValue(n.elem, e, ee.exec(t), n), n;
            }]
        },
        tweener: function (e, t) {
            h(e) ? (t = e, e = ['*']) : e = e.match(/[^\x20\t\r\n\f]+/g);
            for (var n, r = 0, i = e.length; r < i; r++) {
                n = e[r];
                st.tweeners[n] = st.tweeners[n] || [];
                st.tweeners[n].unshift(t);
            }
        },
        prefilters: [function (e, t, n) {
            var r, i, o, a, s, u, l, c, f = 'width' in t || 'height' in t, p = this, d = { r: y && y[r] || utils0.style(e, r) }, h = e.style, g = e.nodeType && oe(e), y = X.get(e, 'fxshow');
            for (r in (n.queue || (null == (a = utils0._queueHooks(e, 'fx')).unqueued && (a.unqueued = 0, s = a.empty.fire, a.empty.fire = function () {
                a.unqueued || s();
            }), a.unqueued++, p.always(function () {
                p.always(function () {
                    a.unqueued--;
                    utils0.queue(e, 'fx').length || a.empty.fire();
                });
            })), t))
                if (i = t[r], /^(?:toggle|show|hide)$/.test(i)) {
                    if (delete t[r], o = o || 'toggle' === i, i === (g ? 'hide' : 'show')) {
                        if ('show' !== i || !y || void 0 === y[r]) {
                            continue;
                        }
                        g = true;
                    }
                    ;
                }
            if ((u = !utils0.isEmptyObject(t)) || !utils0.isEmptyObject(d)) {
                for (r in (f && 1 === e.nodeType && (n.overflow = [
                    h.overflow,
                    h.overflowX,
                    h.overflowY
                ], null == (l = y && y.display) && (l = X.get(e, 'display')), 'none' === (c = utils0.css(e, 'display')) && (l ? c = l : (le([e], true), l = e.style.display || l, c = utils0.css(e, 'display'), le([e]))), ('inline' === c || 'inline-block' === c && null != l) && 'none' === utils0.css(e, 'float') && (u || (p.done(function () {
                    h.display = l;
                }), null == l && (c = h.display, l = 'none' === c ? '' : c)), h.display = 'inline-block')), n.overflow && (h.overflow = 'hidden', p.always(function () {
                    h.overflow = n.overflow[0];
                    h.overflowX = n.overflow[1];
                    h.overflowY = n.overflow[2];
                })), u = false, d))
                    u || (y ? 'hidden' in y && (g = y.hidden) : y = X.access(e, 'fxshow', { display: l }), o && (y.hidden = !g), g && le([e], true), p.done(function () {
                        for (r in (g || le([e]), X.remove(e, 'fxshow'), d))
                            utils0.style(e, r, d[r]);
                    })), u = applyCustomTweener(g ? y[r] : 0, r, p), r in y || (y[r] = u.start, g && (u.end = u.start, u.start = 0));
            }
        }],
        prefilter: function (e, t) {
            t ? st.prefilters.unshift(e) : st.prefilters.push(e);
        }
    });
    utils0.speed = function (e, t, n) {
        var r = e && 'object' == typeof e ? utils0.extend({}, e) : {
            complete: n || !n && t || h(e) && e,
            duration: e,
            easing: n && t || t && !h(t) && t
        };
        return utils0.fx.off ? r.duration = 0 : 'number' != typeof r.duration && (r.duration in utils0.fx.speeds ? r.duration = utils0.fx.speeds[r.duration] : r.duration = utils0.fx.speeds._default), null != r.queue && true !== r.queue || (r.queue = 'fx'), r.old = r.complete, r.complete = function () {
            h(r.old) && r.old.call(this);
            r.queue && utils0.dequeue(this, r.queue);
        }, r;
    };
    utils0.fn.extend({
        fadeTo: function (speed, opacity, easing, callback) {
            // Filter out visible elements and set their opacity to 0 then start animation.
            return this.filter(oe).css('opacity', 0).show().end()
                .animate({ opacity: opacity }, speed, easing, callback);
        },
        animate: function (props, speed, easing, callback) {
            var isEmpty = utils0.isEmptyObject(props);
            var animationOptions = utils0.speed(speed, easing, callback);
            var performAnimation = function () {
                var anim = st(this, utils0.extend({}, props), animationOptions);
                if (isEmpty || X.get(this, 'finish')) {
                    anim.stop(true);
                }
            };
            performAnimation.finish = performAnimation;

            if (isEmpty || animationOptions.queue === false) {
                return this.each(performAnimation);
            } else {
                return this.queue(animationOptions.queue, performAnimation);
            }
        },
        stop: function (type, clearQueue, jumpToEnd) {
            var stopQueue = function (hook) {
                var stop = hook.stop;
                delete hook.stop;
                stop(jumpToEnd);
            };

            if (typeof type !== 'string') {
                jumpToEnd = clearQueue;
                clearQueue = type;
                type = undefined;
            }

            if (clearQueue) {
                this.queue(type || 'fx', []);
            }

            return this.each(function () {
                var stopAll = true;
                var index = type != null ? type + 'queueHooks' : undefined;
                var timers = utils0.timers;
                var data = X.get(this);

                if (index) {
                    if (data[index] && data[index].stop) {
                        stopQueue(data[index]);
                    }
                } else {
                    for (var key in data) {
                        if (data[key] && data[key].stop && /queueHooks$/.test(key)) {
                            stopQueue(data[key]);
                        }
                    }
                }

                for (var i = timers.length; i--;) {
                    var timer = timers[i];
                    if (timer.elem === this && (type == null || timer.queue === type)) {
                        timer.anim.stop(jumpToEnd);
                        stopAll = false;
                        timers.splice(i, 1);
                    }
                }

                if (stopAll || !jumpToEnd) {
                    utils0.dequeue(this, type);
                }
            });
        },
        finish: function (type) {
            if (type !== false) {
                type = type || 'fx';
            }

            return this.each(function () {
                var data = X.get(this);
                var queue = data[type + 'queue'];
                var hooks = data[type + 'queueHooks'];
                var timers = utils0.timers;
                var queueLength = queue ? queue.length : 0;

                data.finish = true;

                utils0.queue(this, type, []);

                if (hooks && hooks.stop) {
                    hooks.stop.call(this, true);
                }

                for (var i = timers.length; i--;) {
                    var timer = timers[i];
                    if (timer.elem === this && timer.queue === type) {
                        timer.anim.stop(true);
                        timers.splice(i, 1);
                    }
                }

                for (var i = 0; i < queueLength; i++) {
                    if (queue[i] && queue[i].finish) {
                        queue[i].finish.call(this);
                    }
                }

                delete data.finish;
            });
        }
    });
    utils0.each([
        'toggle',
        'show',
        'hide'
    ], function (e, t) {
        var n = utils0.fn[t];
        utils0.fn[t] = function (e, r, i) {
            return null == e || 'boolean' == typeof e ? n.apply(this, arguments) : this.animate(createSizeObject(t, true), e, r, i);
        };
    });
    utils0.each({
        slideDown: createSizeObject('show'),
        slideUp: createSizeObject('hide'),
        slideToggle: createSizeObject('toggle'),
        fadeIn: { opacity: 'show' },
        fadeOut: { opacity: 'hide' },
        fadeToggle: { opacity: 'toggle' }
    }, function (e, t) {
        utils0.fn[e] = function (e, n, r) {
            return this.animate(t, e, n, r);
        };
    });
    utils0.timers = [];
    utils0.fx.tick = function () {
        var currentTime = Date.now(),
            activeTimers = utils0.timers;

        // Looping in reverse order to safely remove items from the array
        for (var i = activeTimers.length - 1; i >= 0; i--) {
            var timer = activeTimers[i];
            // If the timer was removed during the call or did not fire, remove it
            if (!timer() || timer !== activeTimers[i])
                activeTimers.splice(i, 1);
        }
    };
    utils0.fx.timer = function (e) {
        utils0.timers.push(e);
        utils0.fx.start();
    };
    utils0.fx.interval = 13;
    utils0.fx.start = function () {
        et || (et = true, rt());
    };
    utils0.fx.stop = function () {
        et = null;
    };
    utils0.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    };
    utils0.fn.delay = function (t, n) {
        return t = utils0.fx && utils0.fx.speeds[t] || t, n = n || 'fx', this.queue(n, function (n, r) {
            var i = e.setTimeout(n, t);
            r.stop = function () {
                e.clearTimeout(i);
            };
        });
    };
    (function () {
        var y = document; // Assuming 'y' refers to 'document'.
        // Create a checkbox input and append it if necessary.
        var checkbox = y.createElement('input');
        checkbox.type = 'checkbox';
        // To append the checkbox to the document, you would need to select an element and append it, not shown here.
        // Example: document.body.appendChild(checkbox);
        // Create a radio input and set its value.
        var radio = y.createElement('input');
        radio.type = 'radio';
        radio.value = 't';
        // Similarly, to append the radio to the document, you need to specify where to append it.
        // Example: document.body.appendChild(radio);
        // The initial code had a select and option elements creation, but they were unused.
        // If needed, they can be created and appended like this:
        var select = y.createElement('select');
        var option = y.createElement('option');
        select.appendChild(option);
        // And appended to the document if necessary.
        // Example: document.body.appendChild(select);
    }());
    var ut, lt = utils0.expr.attrHandle;
    utils0.fn.extend({
        attr: function (e, t) {
            return F(this, utils0.attr, e, t, arguments.length > 1);
        },
        removeAttr: function (e) {
            return this.each(function () {
                utils0.removeAttr(this, e);
            });
        }
    });
    // Define utility functions for managing attributes.
    utils0.extend({
        // Handles getting and setting attributes.
        attr: function (element, name, value) {
            var result, hooks, type = element.nodeType;

            // Ignore text, comment, and attribute nodes.
            if (type === 3 || type === 8 || type === 2) {
                return;
            }

            // Fallback to prop for elements that do not support getAttribute.
            if (typeof element.getAttribute === "undefined") {
                return utils0.prop(element, name, value);
            }

            // 1 represents an element node.
            if (type === 1 && !utils0.isXMLDoc(element)) {
                hooks = utils0.attrHooks[name.toLowerCase()] ||
                    (utils0.expr.match.bool.test(name) ? booleanHook : undefined);
            }

            if (value !== undefined) {
                if (value === null) {
                    // Remove attribute if value is null.
                    utils0.removeAttr(element, name);
                    return;
                }

                if (hooks && 'set' in hooks && (result = hooks.set(element, value, name)) !== undefined) {
                    // Set attribute using hooks if available.
                    return result;
                } else {
                    // Default set attribute.
                    element.setAttribute(name, value + '');
                    return value;
                }
            } else {
                if (hooks && 'get' in hooks && (result = hooks.get(element, name)) !== null) {
                    // Get attribute using hooks if available.
                    return result;
                } else {
                    // Default get attribute if hooks not available or do not return a value.
                    result = utils0.find.attr(element, name);
                    return result == null ? undefined : result;
                }
            }
        },
        // Specific hooks for certain attributes.
        attrHooks: {
            type: {
                set: function (element, value) {
                    // Logic to handle the setting of 'type' attribute for input elements.
                    if (!d.radioValue && value === 'radio' && A(element, 'input')) {
                        var val = element.value;
                        element.setAttribute('type', value);
                        if (val) {
                            element.value = val;
                        }
                        return value;
                    }
                }
            }
        },
        // Removes an attribute from an element.
        removeAttr: function (element, name) {
            var names = name && name.match(/[^\x20\t\r\n\f]+/g);
            var i = 0;

            if (names && element.nodeType === 1) {
                // Iterate over all the names and remove each one.
                while ((name = names[i++])) {
                    element.removeAttribute(name);
                }
            }
        }
    });
    ut = {
        set: function (e, t, n) {
            return false === t ? utils0.removeAttr(e, n) : e.setAttribute(n, n), n;
        }
    };
    utils0.each(utils0.expr.match.bool.source.match(/\w+/g), function (e, t) {
        var n = lt[t] || utils0.find.attr;
        lt[t] = function (e, t, r) {
            var i, o, a = t.toLowerCase();
            return r || (o = lt[a], lt[a] = i, i = null != n(e, t, r) ? a : null, lt[a] = o), i;
        };
    });
    ;
    function pt(e) {
        return (e.match(/[^\x20\t\r\n\f]+/g) || []).join(' ');
    }
    function dt(e) {
        return e.getAttribute && e.getAttribute('class') || '';
    }
    function ht(e) {
        return Array.isArray(e) ? e : 'string' == typeof e && e.match(/[^\x20\t\r\n\f]+/g) || [];
    }
    utils0.fn.extend({
        prop: function (e, t) {
            return F(this, utils0.prop, e, t, arguments.length > 1);
        },
        removeProp: function (e) {
            return this.each(function () {
                delete this[utils0.propFix[e] || e];
            });
        }
    });
    utils0.extend({
        prop: function (elem, name, value) {
            var ret,
                hooks,
                notXML = elem.nodeType !== 1 || !utils0.isXMLDoc(elem),
                isElemProperty = notXML && utils0.propFix[name] || name;

            // Use property hooks, if available
            hooks = utils0.propHooks[isElemProperty];

            if (value !== undefined) {
                if (hooks && 'set' in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
                    return ret;
                } else {
                    // Set the value if no hook or the hook doesn't return anything
                    return (elem[isElemProperty] = value);
                }
            } else {
                if (hooks && 'get' in hooks && (ret = hooks.get(elem, name)) !== null) {
                    return ret;
                } else {
                    // Get the value directly if no hook or the hook doesn't return anything
                    return elem[isElemProperty];
                }
            }
        },
        propHooks: {
            tabIndex: {
                get: function (elem) {
                    // Use the proper attribute retrieval function from utils0
                    var tabIndexAttr = utils0.find.attr(elem, 'tabindex');
                    if (tabIndexAttr) {
                        return parseInt(tabIndexAttr, 10);
                    } else if (
                        /^(?:input|select|textarea|button)$/i.test(elem.nodeName) ||
                        (/^(?:a|area)$/i.test(elem.nodeName) && elem.href)
                    ) {
                        return 0;
                    } else {
                        return -1;
                    }
                }
            }
        },
        propFix: {
            'for': 'htmlFor',
            'class': 'className'
        }
    });
    d.optSelected || (utils0.propHooks.selected = {
        get: function (e) {
            var t = e.parentNode;
            return t && t.parentNode && t.parentNode.selectedIndex, null;
        },
        set: function (e) {
            var t = e.parentNode;
            t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex);
        }
    });
    utils0.each([
        'tabIndex',
        'readOnly',
        'maxLength',
        'cellSpacing',
        'cellPadding',
        'rowSpan',
        'colSpan',
        'useMap',
        'frameBorder',
        'contentEditable'
    ], function () {
        utils0.propFix[this.toLowerCase()] = this;
    });
    utils0.fn.extend({
        addClass: function (className) {
            if (h(className)) {
                return this.each(function (index) {
                    utils0(this).addClass(className.call(this, index, getClass(this)));
                });
            }

            const classesToAdd = getClasses(className);

            if (classesToAdd.length) {
                this.each(function () {
                    if (this.nodeType === 1) {
                        let currentClass = getClass(this);
                        let updatedClass = currentClass;

                        classesToAdd.forEach(function (cls) {
                            if (updatedClass.indexOf(` ${cls} `) < 0) {
                                updatedClass += `${cls} `;
                            }
                        });

                        updatedClass = trimClass(updatedClass);

                        if (currentClass !== updatedClass) {
                            this.setAttribute('class', updatedClass);
                        }
                    }
                });
            }

            return this;
        },

        removeClass: function (className) {
            if (h(className)) {
                return this.each(function (index) {
                    utils0(this).removeClass(className.call(this, index, getClass(this)));
                });
            }

            if (arguments.length === 0) {
                return this.attr('class', '');
            }

            const classesToRemove = getClasses(className);

            if (classesToRemove.length) {
                this.each(function () {
                    if (this.nodeType === 1) {
                        let currentClass = ` ${getClass(this)} `;
                        classesToRemove.forEach(function (cls) {
                            currentClass = currentClass.replace(` ${cls} `, ' ');
                        });

                        const updatedClass = trimClass(currentClass);
                        if (getClass(this) !== updatedClass) {
                            this.setAttribute('class', updatedClass);
                        }
                    }
                });
            }

            return this;
        },

        toggleClass: function (className, state) {
            const isStringOrArray = typeof className === 'string' || Array.isArray(className);

            if (typeof state === 'boolean' && isStringOrArray) {
                return state ? this.addClass(className) : this.removeClass(className);
            }

            if (h(className)) {
                return this.each(function (index) {
                    utils0(this).toggleClass(className.call(this, index, getClass(this), state), state);
                });
            }

            return this.each(function () {
                if (isStringOrArray) {
                    toggleClasses(this, className);
                } else if (className === undefined || typeof className === 'boolean') {
                    toggleByState(this, className);
                }
            });

            function toggleClasses(element, classNames) {
                const $element = utils0(element);
                const classList = getClasses(classNames);

                classList.forEach(function (cls) {
                    $element.hasClass(cls) ? $element.removeClass(cls) : $element.addClass(cls);
                });
            }

            function toggleByState(element, state) {
                const className = getClass(element);
                if (className) {
                    X.set(element, '__className__', className);
                }
                element.setAttribute('class', className || state === false ? '' : X.get(element, '__className__') || '');
            }
        },

        hasClass: function (className) {
            const classString = ` ${className} `;
            return this.toArray().some(function (element) {
                return element.nodeType === 1 && (` ${trimClass(getClass(element))} `).indexOf(classString) > -1;
            });
        }
    });

    // Helper functions to manage class strings
    function h(func) {
        return typeof func === 'function';
    }

    function getClasses(classString) {
        return ht(classString);
    }

    function getClass(element) {
        return dt(element);
    }

    function trimClass(classString) {
        return pt(classString);
    }
    utils0.fn.extend({
        val: function (valueToSet) {
            var hooks, returnValue, valueIsFunction, el = this[0];

            // Function to handle setting the value
            function setValue(element, index, oldValue) {
                var newValue = valueIsFunction ? valueToSet.call(element, index, oldValue) : valueToSet;
                if (newValue == null) {
                    newValue = '';
                } else if (typeof newValue === 'number') {
                    newValue = String(newValue);
                } else if (Array.isArray(newValue)) {
                    newValue = newValue.map(e => e == null ? '' : String(e));
                }

                hooks = utils0.valHooks[element.type] || utils0.valHooks[element.nodeName.toLowerCase()];

                if (hooks && 'set' in hooks && hooks.set(element, newValue, 'value') !== undefined) {
                    // Hook-based value setting
                } else {
                    element.value = newValue;  // Direct value setting
                }
            }

            if (arguments.length) {
                // Function is called to set value
                valueIsFunction = typeof valueToSet === 'function';
                this.each(function (index) {
                    setValue(this, index, utils0(this).val());
                });
            } else if (el) {
                // Function is called to get value
                hooks = utils0.valHooks[el.type] || utils0.valHooks[el.nodeName.toLowerCase()];

                if (hooks && 'get' in hooks && (returnValue = hooks.get(el, 'value')) !== undefined) {
                    return returnValue;  // Hook-based value getting
                }

                returnValue = el.value;
                return typeof returnValue === 'string' ? returnValue.replace(/\r/g, '') : returnValue == null ? '' : returnValue;
            }
        }
    });
    utils0.extend({
        valHooks: {
            option: {
                // Improved readability by using a descriptive function name and removing unnecessary checks
                get: function (elem) {
                    let valueAttr = utils0.find.attr(elem, 'value');
                    // Use utils0.text() directly since it handles the null/undefined case.
                    return valueAttr !== null ? valueAttr : utils0.text(elem).trim();
                }
            },
            select: {
                // More descriptive variable names and deconstructing for better understanding of code block
                get: function (elem) {
                    let options = elem.options,
                        selectedIndex = elem.selectedIndex,
                        selectOne = elem.type === 'select-one',
                        values = selectOne ? null : [],
                        maxIndex = selectOne ? selectedIndex + 1 : options.length,
                        option,
                        isOptionSelected;

                    for (let index = selectedIndex < 0 ? maxIndex : selectOne ? selectedIndex : 0; index < maxIndex; index++) {
                        option = options[index];
                        isOptionSelected = (option.selected || index === selectedIndex) &&
                            !option.disabled &&
                            (!option.parentNode.disabled || !A(option.parentNode, 'optgroup'));

                        if (isOptionSelected) {
                            let val = utils0(option).val();
                            if (selectOne) {
                                return val;
                            }
                            values.push(val);
                        }
                    }
                    return values;
                },
                // Clarify logic for setting values with more structured code
                set: function (elem, values) {
                    let options = elem.options,
                        valuesToSet = utils0.makeArray(values),
                        isSelected = false;

                    for (let i = options.length - 1; i >= 0; i--) {
                        let option = options[i],
                            value = utils0.valHooks.option.get(option);

                        let isValueInSet = utils0.inArray(value, valuesToSet) > -1;
                        option.selected = isValueInSet;
                        if (isValueInSet) {
                            isSelected = true;
                        }
                    }

                    // If none of the options were selected, reset the selectedIndex
                    if (!isSelected) {
                        elem.selectedIndex = -1;
                    }

                    // Ensure selected options persist
                    return valuesToSet;
                }
            }
        }
    });
    utils0.each([
        'radio',
        'checkbox'
    ], function () {
        utils0.valHooks[this] = {
            set: function (e, t) {
                if (Array.isArray(t)) {
                    return e.checked = utils0.inArray(utils0(e).val(), t) > -1;
                }
            }
        };
        d.checkOn || (utils0.valHooks[this].get = function (e) {
            return null === e.getAttribute('value') ? 'on' : e.value;
        });
    });
    ;
    var vt = function (e) {
        e.stopPropagation();
    };
    utils0.extend(utils0.event, {
        trigger: function (eventType, data, context, isTrigger) {
            var event, cleanEventType, namespaces, eventDataArray, eventTypeBase, hasNamespace;
            var dispatch, eventTarget, bubbles, curTarget, win;

            eventDataArray = [context || document]; // Setting a default context (document) if none provided
            cleanEventType = typeof eventType === 'object' ? eventType.type : eventType;
            namespaces = typeof eventType === 'object' && eventType.namespace ? eventType.namespace.split('.') : [];

            dispatch = eventTarget = curTarget = context = context || document;

            // Avoid triggering events on text and comment nodes
            if (context.nodeType !== 3 && context.nodeType !== 8 && !/^(?:focusinfocus|focusoutblur)$/.test(cleanEventType + utils0.event.triggered)) {

                if (cleanEventType.indexOf('.') > -1) {
                    // The eventType contains a namespace, so isolate the base type and sort the namespaces
                    namespaces = cleanEventType.split('.');
                    cleanEventType = namespaces.shift();
                    namespaces.sort();
                }

                eventTypeBase = cleanEventType.indexOf(':') < 0 && 'on' + cleanEventType;
                event = eventType[utils0.expando] ? eventType : new utils0.Event(cleanEventType, typeof eventType === 'object' && eventType);

                event.isTrigger = isTrigger ? 2 : 3;
                event.namespace = namespaces.join('.');
                event.rnamespace = event.namespace ? new RegExp('(^|\\.)' + namespaces.join('\\.(?:.*\\.|)') + '(\\.|$)') : null;

                event.result = undefined;
                if (!event.target) event.target = context;
                data = data == null ? [event] : utils0.makeArray(data, [event]);

                special = utils0.event.special[cleanEventType] || {};

                if (!isTrigger && !special.trigger || special.trigger.apply(context, data) !== false) {
                    // Determine event propagation path if the event does not bubble
                    if (!isTrigger && !special.noBubble && !utils0.isWindow(context)) {
                        bubbles = special.delegateType || cleanEventType;

                        // Bubble up the document tree
                        for (curTarget = curTarget.parentNode; curTarget; curTarget = curTarget.parentNode) {
                            eventDataArray.push(curTarget);
                            dispatch = curTarget;
                        }

                        // Add window if reached at document level
                        if (dispatch === (context.ownerDocument || document)) {
                            eventDataArray.push(dispatch.defaultView || dispatch.parentWindow || window);
                        }
                    }

                    // Fire handlers on the event path
                    for (var i = 0; (curTarget = eventDataArray[i++]) && !event.isPropagationStopped();) {
                        event.type = i > 1 ? bubbles : special.bindType || cleanEventType;
                        handler = (utils0._data(curTarget, 'events') || {})[event.type] && utils0._data(curTarget, 'handle');

                        if (handler) handler.apply(curTarget, data);
                        handler = eventTypeBase && curTarget[eventTypeBase];
                        if (handler && handler.apply && utils0.acceptData(curTarget)) {
                            event.result = handler.apply(curTarget, data);
                            if (event.result === false) event.preventDefault();
                        }
                    }

                    event.type = cleanEventType;

                    // If nobody prevented the default action, do it now
                    if (!isTrigger && !event.isDefaultPrevented()) {
                        if ((!special._default || special._default.apply(eventDataArray.pop(), data) === false) &&
                            utils0.acceptData(context)) {
                            // Call a native DOM method on the target with the same name as the event.
                            // Can't use an .isFunction() check here because IE6/7 fails that test.
                            if (eventTypeBase && utils0.isFunction(context[cleanEventType]) && !utils0.isWindow(context)) {
                                // Don't re-trigger an onFOO event when we call its FOO() method
                                save = context[eventTypeBase];

                                if (save) context[eventTypeBase] = null;

                                // Prevent re-triggering of the same event, since we already bubbled it above
                                utils0.event.triggered = cleanEventType;

                                context[cleanEventType]();

                                utils0.event.triggered = undefined;

                                if (save) context[eventTypeBase] = save;
                            }
                        }
                    }

                    return event.result;
                }
            }
        },
        simulate: function (type, element, event) {
            var e = utils0.extend(
                new utils0.Event(), event, { type: type, isSimulated: true }
            );
            utils0.event.trigger(e, null, element);
        }
    });
    utils0.fn.extend({
        trigger: function (e, t) {
            return this.each(function () {
                utils0.event.trigger(e, t, this);
            });
        },
        triggerHandler: function (e, t) {
            var n = this[0];
            if (n) {
                return utils0.event.trigger(e, t, n, true);
            }
        }
    });
    d.focusin || utils0.each({
        focus: 'focusin',
        blur: 'focusout'
    }, function (e, t) {
        var n = function (e) {
            utils0.event.simulate(t, e.target, utils0.event.fix(e));
        };
        utils0.event.special[t] = {
            setup: function () {
                var r = this.ownerDocument || this.document || this, i = X.access(r, t);
                i || r.addEventListener(e, n, true);
                X.access(r, t, (i || 0) + 1);
            },
            teardown: function () {
                var r = this.ownerDocument || this.document || this, i = X.access(r, t) - 1;
                i ? X.access(r, t, i) : (r.removeEventListener(e, n, true), X.remove(r, t));
            }
        };
    });
    var mt = e.location, xt = { guid: Date.now() };
    utils0.parseXML = function (t) {
        var n, r;
        if (!t || 'string' != typeof t) {
            return null;
        }
        try {
            n = new e.DOMParser().parseFromString(t, 'text/xml');
        } catch (e) {
        }
        return r = n && n.getElementsByTagName('parsererror')[0], n && !r || utils0.error('Invalid XML: ' + (r ? utils0.map(r.childNodes, function (e) {
            return e.textContent;
        }).join('\n') : t)), n;
    };
    ;
    function Et(e, t, n, r) {
        var i;
        if (Array.isArray(t)) {
            utils0.each(t, function (t, i) {
                n || /\[\]$/.test(e) ? r(e, i) : Et(e + '[' + ('object' == typeof i && null != i ? t : '') + ']', i, n, r);
            });
        } else {
            if (n || 'object' !== x(t)) {
                r(e, t);
            } else {
                for (i in t)
                    Et(e + '[' + i + ']', t[i], n, r);
            }
        }
    }
    utils0.param = function (e, t) {
        var n, r = [], i = function (e, t) {
            var n = h(t) ? t() : t;
            r[r.length] = encodeURIComponent(e) + '=' + encodeURIComponent(null == n ? '' : n);
        };
        if (null == e) {
            return '';
        }
        if (Array.isArray(e) || e.jquery && !utils0.isPlainObject(e)) {
            utils0.each(e, function () {
                i(this.name, this.value);
            });
        } else {
            for (n in e)
                Et(n, e[n], t, i);
        }
        return r.join('&');
    };
    utils0.fn.extend({
        serialize: function () {
            return utils0.param(this.serializeArray());
        },
        serializeArray: function () {
            return this.map(function () {
                var e = utils0.prop(this, 'elements');
                return e ? utils0.makeArray(e) : this;
            }).filter(function () {
                var e = this.type;
                return this.name && !utils0(this).is(':disabled') && /^(?:input|select|textarea|keygen)/i.test(this.nodeName) && !/^(?:submit|button|image|reset|file)$/i.test(e) && (this.checked || !/^(?:checkbox|radio)$/i.test(e));
            }).map(function (e, t) {
                var n = utils0(this).val();
                return null == n ? null : Array.isArray(n) ? utils0.map(n, function (e) {
                    return {
                        name: t.name,
                        value: e.replace(/\r?\n/g, '\r\n')
                    };
                }) : {
                    name: t.name,
                    value: n.replace(/\r?\n/g, '\r\n')
                };
            }).get();
        }
    });
    var qt = {}, Ht = {}, Mt = '*/'.concat('*'), Pt = y.createElement('a');
    function Ot(e) {
        return function (t, n) {
            'string' != typeof t && (n = t, t = '*');
            var r, i = 0, o = t.toLowerCase().match(/[^\x20\t\r\n\f]+/g) || [];
            if (h(n)) {
                for (; r = o[i++];) {
                    '+' === r[0] ? (r = r.slice(1) || '*', (e[r] = e[r] || []).unshift(n)) : (e[r] = e[r] || []).push(n);
                }
            }
        };
    }
    function Rt(e, t, n, r) {
        var i = {}, o = e === Ht;
        function a(s) {
            var u;
            return i[s] = true, utils0.each(e[s] || [], function (e, s) {
                var l = s(t, n, r);
                return 'string' != typeof l || o || i[l] ? o ? !(u = l) : void 0 : (t.dataTypes.unshift(l), a(l), false);
            }), u;
        }
        return a(t.dataTypes[0]) || !i['*'] && a('*');
    }
    function It(e, t) {
        var n, r, i = utils0.ajaxSettings.flatOptions || {};
        for (n in t)
            void 0 !== t[n] && ((i[n] ? e : r || (r = {}))[n] = t[n]);
        return r && utils0.extend(true, e, r), e;
    }
    Pt.href = mt.href;
    utils0.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: mt.href,
            type: 'GET',
            isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(mt.protocol),
            global: true,
            processData: true,
            async: true,
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            accepts: {
                '*': Mt,
                text: 'text/plain',
                html: 'text/html',
                xml: 'application/xml, text/xml',
                json: 'application/json, text/javascript'
            },
            contents: {
                xml: /\bxml\b/,
                html: /\bhtml/,
                json: /\bjson\b/
            },
            responseFields: {
                xml: 'responseXML',
                text: 'responseText',
                json: 'responseJSON'
            },
            converters: {
                '* text': String,
                'text html': true,
                'text json': JSON.parse,
                'text xml': utils0.parseXML
            },
            flatOptions: {
                url: true,
                context: true
            }
        },
        ajaxSetup: function (e, t) {
            return t ? It(It(e, utils0.ajaxSettings), t) : It(utils0.ajaxSettings, e);
        },
        ajaxPrefilter: Ot(qt),
        ajaxTransport: Ot(Ht),
        ajax: function (t, n) {
            'object' == typeof t && (n = t, t = void 0);
            n = n || {};
            var r, i, o, a, s, u, l, c, f, p, d = utils0.ajaxSetup({}, n), h = d.context || d, g = d.context && (h.nodeType || h.jquery) ? utils0(h) : utils0.event, v = utils0.Deferred(), m = utils0.Callbacks('once memory'), x = d.statusCode || {}, w = {}, C = {}, T = 'canceled', S = {
                readyState: 0,
                getResponseHeader: function (e) {
                    var t;
                    if (l) {
                        if (!a) {
                            for (a = {}; t = /^(.*?):[ \t]*([^\r\n]*)$/gm.exec(o);) {
                                a[t[1].toLowerCase() + ' '] = (a[t[1].toLowerCase() + ' '] || []).concat(t[2]);
                            }
                        }
                        t = a[e.toLowerCase() + ' '];
                    }
                    return null == t ? null : t.join(', ');
                },
                getAllResponseHeaders: function () {
                    return l ? o : null;
                },
                setRequestHeader: function (e, t) {
                    return null == l && (e = C[e.toLowerCase()] = C[e.toLowerCase()] || e, w[e] = t), this;
                },
                overrideMimeType: function (e) {
                    return null == l && (d.mimeType = e), this;
                },
                statusCode: function (e) {
                    var t;
                    if (e) {
                        if (l) {
                            S.always(e[S.status]);
                        } else {
                            for (t in e)
                                x[t] = [
                                    x[t],
                                    e[t]
                                ];
                        }
                    }
                    return this;
                },
                abort: function (e) {
                    var t = e || T;
                    return r && r.abort(t), E(0, t), this;
                }
            };
            if (v.promise(S), d.url = ((t || d.url || mt.href) + '').replace(/^\/\//, mt.protocol + '//'), d.type = n.method || n.type || d.method || d.type, d.dataTypes = (d.dataType || '*').toLowerCase().match(/[^\x20\t\r\n\f]+/g) || [''], null == d.crossDomain) {
                u = y.createElement('a');
                try {
                    ;
                    ;
                    ;
                } catch (e) {
                    ;
                }
            }
            if (d.data && d.processData && 'string' != typeof d.data && (d.data = utils0.param(d.data, d.traditional)), Rt(qt, d, n, S), l) {
                return S;
            }
            for (f in ((c = utils0.event && d.global) && 0 == utils0.active++ && utils0.event.trigger('ajaxStart'), d.type = d.type.toUpperCase(), d.hasContent = !/^(?:GET|HEAD)$/.test(d.type), i = d.url.replace(/#.*$/, ''), d.hasContent ? d.data && d.processData && 0 === (d.contentType || '').indexOf('application/x-www-form-urlencoded') && (d.data = d.data.replace(/%20/g, '+')) : (p = d.url.slice(i.length), d.data && (d.processData || 'string' == typeof d.data) && (i += (/\?/.test(i) ? '&' : '?') + d.data, delete d.data), false === d.cache && (i = i.replace(/([?&])_=[^&]*/, '$1'), p = (/\?/.test(i) ? '&' : '?') + '_=' + xt.guid++ + p), d.url = i + p), d.ifModified && (utils0.lastModified[i] && S.setRequestHeader('If-Modified-Since', utils0.lastModified[i]), utils0.etag[i] && S.setRequestHeader('If-None-Match', utils0.etag[i])), (d.data && d.hasContent && false !== d.contentType || n.contentType) && S.setRequestHeader('Content-Type', d.contentType), S.setRequestHeader('Accept', d.dataTypes[0] && d.accepts[d.dataTypes[0]] ? d.accepts[d.dataTypes[0]] + ('*' !== d.dataTypes[0] ? ', ' + Mt + '; q=0.01' : '') : d.accepts['*']), d.headers))
                S.setRequestHeader(f, d.headers[f]);
            if (d.beforeSend && (false === d.beforeSend.call(h, S, d) || l)) {
                return S.abort();
            }
            if (T = 'abort', m.add(d.complete), S.done(d.success), S.fail(d.error), r = Rt(Ht, d, n, S)) {
                if (S.readyState = 1, c && g.trigger('ajaxSend', [
                    S,
                    d
                ]), l) {
                    return S;
                }
                d.async && d.timeout > 0 && (s = e.setTimeout(function () {
                    S.abort('timeout');
                }, d.timeout));
                try {
                    l = false;
                    r.send(w, E);
                } catch (e) {
                    if (l) {
                        throw e;
                    }
                    E(-1, e);
                }
            } else {
                E(-1, 'No Transport');
            }
            function E(t, n, a, u) {
                var f, p, y, w, C, T = n;
                l || (l = true, s && e.clearTimeout(s), r = void 0, o = u || '', S.readyState = t > 0 ? 4 : 0, f = t >= 200 && t < 300 || 304 === t, a && (w = function (e, t, n) {
                    for (var r, i, o, a, s = e.contents, u = e.dataTypes; '*' === u[0];) {
                        u.shift();
                        void 0 === r && (r = e.mimeType || t.getResponseHeader('Content-Type'));
                    }
                    if (r) {
                        for (i in s)
                            if (s[i] && s[i].test(r)) {
                                u.unshift(i);
                                break;
                            }
                    }
                    if (u[0] in n) {
                        o = u[0];
                    } else {
                        for (i in n) {
                            if (!u[0] || e.converters[i + ' ' + u[0]]) {
                                o = i;
                                break;
                            }
                            a || (a = i);
                        }
                        o = o || a;
                    }
                    if (o) {
                        return o !== u[0] && u.unshift(o), n[o];
                    }
                }(d, S, a)), !f && utils0.inArray('script', d.dataTypes) > -1 && utils0.inArray('json', d.dataTypes) < 0 && (d.converters['text script'] = function () {
                }), w = function (e, t, n, r) {
                    var i, o, a, s, u, l = {}, c = e.dataTypes.slice();
                    if (c[1]) {
                        for (a in e.converters)
                            l[a.toLowerCase()] = e.converters[a];
                    }
                    for (o = c.shift(); o;) {
                        if (e.responseFields[o] && (n[e.responseFields[o]] = t), !u && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)), u = o, o = c.shift()) {
                            if ('*' === o) {
                                o = u;
                            } else {
                                if ('*' !== u && u !== o) {
                                    if (!(a = l[u + ' ' + o] || l['* ' + o])) {
                                        for (i in l)
                                            if ((s = i.split(' '))[1] === o && (a = l[u + ' ' + s[0]] || l['* ' + s[0]])) {
                                                true === a ? a = l[i] : true !== l[i] && (o = s[0], c.unshift(s[1]));
                                                break;
                                            }
                                    }
                                    if (true !== a) {
                                        if (a && e.throws) {
                                            t = a(t);
                                        } else {
                                            try {
                                                t = a(t);
                                            } catch (e) {
                                                return {
                                                    state: 'parsererror',
                                                    error: a ? e : 'No conversion from ' + u + ' to ' + o
                                                };
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return {
                        state: 'success',
                        data: t
                    };
                }(d, w, S, f), f ? (d.ifModified && ((C = S.getResponseHeader('Last-Modified')) && (utils0.lastModified[i] = C), (C = S.getResponseHeader('etag')) && (utils0.etag[i] = C)), 204 === t || 'HEAD' === d.type ? T = 'nocontent' : 304 === t ? T = 'notmodified' : (T = w.state, p = w.data, f = !(y = w.error))) : (y = T, !t && T || (T = 'error', t < 0 && (t = 0))), S.status = t, S.statusText = (n || T) + '', f ? v.resolveWith(h, [
                    p,
                    T,
                    S
                ]) : v.rejectWith(h, [
                    S,
                    T,
                    y
                ]), S.statusCode(x), x = void 0, c && g.trigger(f ? 'ajaxSuccess' : 'ajaxError', [
                    S,
                    d,
                    f ? p : y
                ]), m.fireWith(h, [
                    S,
                    T
                ]), c && (g.trigger('ajaxComplete', [
                    S,
                    d
                ]), --utils0.active || utils0.event.trigger('ajaxStop')));
            }
            return S;
        },
        getJSON: function (e, t, n) {
            return utils0.get(e, t, n, 'json');
        },
        getScript: function (e, t) {
            return utils0.get(e, void 0, t, 'script');
        }
    });
    utils0.each([
        'get',
        'post'
    ], function (e, t) {
        utils0[t] = function (e, n, r, i) {
            return h(n) && (i = i || r, r = n, n = void 0), utils0.ajax(utils0.extend({
                url: e,
                type: t,
                dataType: i,
                data: n,
                success: r
            }, utils0.isPlainObject(e) && e));
        };
    });
    utils0.ajaxPrefilter(function (e) {
        var t;
        for (t in e.headers)
            'content-type' === t.toLowerCase() && (e.contentType = e.headers[t] || '');
    });
    utils0._evalUrl = function (e, t, n) {
        return utils0.ajax({
            url: e,
            type: 'GET',
            dataType: 'script',
            cache: true,
            async: false,
            global: false,
            converters: {
                'text script': function () {
                }
            },
            dataFilter: function (e) {
                utils0.globalEval(e, t, n);
            }
        });
    };
    utils0.fn.extend({
        wrapAll: function (e) {
            var t;
            return this[0] && (h(e) && (e = e.call(this[0])), t = utils0(e, this[0].ownerDocument).eq(0).clone(true), this[0].parentNode && t.insertBefore(this[0]), t.map(function () {
                for (var e = this; e.firstElementChild;) {
                    e = e.firstElementChild;
                }
                return e;
            }).append(this)), this;
        },
        wrapInner: function (e) {
            return h(e) ? this.each(function (t) {
                utils0(this).wrapInner(e.call(this, t));
            }) : this.each(function () {
                var t = utils0(this), n = t.contents();
                n.length ? n.wrapAll(e) : t.append(e);
            });
        },
        wrap: function (e) {
            var t = h(e);
            return this.each(function (n) {
                utils0(this).wrapAll(t ? e.call(this, n) : e);
            });
        },
        unwrap: function (e) {
            return this.parent(e).not('body').each(function () {
                utils0(this).replaceWith(this.childNodes);
            }), this;
        }
    });
    utils0.expr.pseudos.hidden = function (e) {
        return !utils0.expr.pseudos.visible(e);
    };
    utils0.expr.pseudos.visible = function (e) {
        return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
    };
    utils0.ajaxSettings.xhr = function () {
        try {
            return new e.XMLHttpRequest();
        } catch (e) {
        }
    };
    var Wt = utils0.ajaxSettings.xhr();
    ;
    ;
    utils0.ajaxTransport(function (t) {
        var n, r;
        if (d.cors || Wt && !t.crossDomain) {
            return {
                send: function (i, o) {
                    var a, s = t.xhr();
                    if (s.open(t.type, t.url, t.async, t.username, t.password), t.xhrFields) {
                        for (a in t.xhrFields)
                            s[a] = t.xhrFields[a];
                    }
                    for (a in (t.mimeType && s.overrideMimeType && s.overrideMimeType(t.mimeType), t.crossDomain || i['X-Requested-With'] || (i['X-Requested-With'] = 'XMLHttpRequest'), i))
                        s.setRequestHeader(a, i[a]);
                    n = function (e) {
                        return function () {
                            n && (n = r = s.onload = s.onerror = s.onabort = s.ontimeout = s.onreadystatechange = null, 'abort' === e ? s.abort() : 'error' === e ? 'number' != typeof s.status ? o(0, 'error') : o(s.status, s.statusText) : o(Bt[s.status] || s.status, s.statusText, 'text' !== (s.responseType || 'text') || 'string' != typeof s.responseText ? { binary: s.response } : { text: s.responseText }, s.getAllResponseHeaders()));
                        };
                    };
                    s.onload = n();
                    r = s.onerror = s.ontimeout = n('error');
                    void 0 !== s.onabort ? s.onabort = r : s.onreadystatechange = function () {
                        4 === s.readyState && e.setTimeout(function () {
                            n && r();
                        });
                    };
                    n = n('abort');
                    try {
                        s.send(t.hasContent && t.data || null);
                    } catch (e) {
                        if (n) {
                            throw e;
                        }
                    }
                },
                abort: function () {
                    n && n();
                }
            };
        }
    });
    utils0.ajaxPrefilter(function (e) {
        e.crossDomain && (e.contents.script = false);
    });
    utils0.ajaxSetup({
        accepts: { script: 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript' },
        contents: { script: /\b(?:java|ecma)script\b/ },
        converters: {
            'text script': function (e) {
                return utils0.globalEval(e), e;
            }
        }
    });
    utils0.ajaxPrefilter('script', function (e) {
        void 0 === e.cache && (e.cache = false);
        e.crossDomain && (e.type = 'GET');
    });
    utils0.ajaxTransport('script', function (e) {
        var t, n;
        if (e.crossDomain || e.scriptAttrs) {
            return {
                send: function (r, i) {
                    t = utils0('<script>').attr(e.scriptAttrs || {}).prop({
                        charset: e.scriptCharset,
                        src: e.url
                    }).on('load error', n = function (e) {
                        t.remove();
                        n = null;
                        e && i('error' === e.type ? 404 : 200, e.type);
                    });
                    y.head.appendChild(t[0]);
                },
                abort: function () {
                    n && n();
                }
            };
        }
    });
    var Ft, $t = [];
    utils0.ajaxSetup({
        jsonp: 'callback',
        jsonpCallback: function () {
            var e = $t.pop() || utils0.expando + '_' + xt.guid++;
            return this[e] = true, e;
        }
    });
    utils0.ajaxPrefilter('json jsonp', function (t, n, r) {
        var i, o, a, s = false !== t.jsonp && (/(=)\?(?=&|$)|\?\?/.test(t.url) ? 'url' : 'string' == typeof t.data && 0 === (t.contentType || '').indexOf('application/x-www-form-urlencoded') && /(=)\?(?=&|$)|\?\?/.test(t.data) && 'data');
        if (s || 'jsonp' === t.dataTypes[0]) {
            return i = t.jsonpCallback = h(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback, s ? t[s] = t[s].replace(/(=)\?(?=&|$)|\?\?/, '$1' + i) : false !== t.jsonp && (t.url += (/\?/.test(t.url) ? '&' : '?') + t.jsonp + '=' + i), t.converters['script json'] = function () {
                return a || utils0.error(i + ' was not called'), a[0];
            }, t.dataTypes[0] = 'json', o = e[i], e[i] = function () {
                a = arguments;
            }, r.always(function () {
                void 0 === o ? utils0(e).removeProp(i) : e[i] = o;
                t[i] && (t.jsonpCallback = n.jsonpCallback, $t.push(i));
                a && h(o) && o(a[0]);
                a = o = void 0;
            }), 'script';
        }
    });
    ;
    utils0.parseHTML = function (e, t, n) {
        return 'string' != typeof e ? [] : ('boolean' == typeof t && (n = t, t = false), t || (d.createHTMLDocument ? ((r = (t = y.implementation.createHTMLDocument('')).createElement('base')).href = y.location.href, t.head.appendChild(r)) : t = y), i = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i.exec(e), o = !n && [], i ? [t.createElement(i[1])] : (i = createFragmentFromHTML([e], t, o), o && o.length && utils0(o).remove(), utils0.merge([], i.childNodes)));
        var r, i, o;
    };
    utils0.fn.load = function (e, t, n) {
        var r, i, o, a = this, s = e.indexOf(' ');
        return s > -1 && (r = pt(e.slice(s)), e = e.slice(0, s)), h(t) ? (n = t, t = void 0) : t && 'object' == typeof t && (i = 'POST'), a.length > 0 && utils0.ajax({
            url: e,
            type: i || 'GET',
            dataType: 'html',
            data: t
        }).done(function (e) {
            o = arguments;
            a.html(r ? utils0('<div>').append(utils0.parseHTML(e)).find(r) : e);
        }).always(n && function (e, t) {
            a.each(function () {
                n.apply(this, o || [
                    e.responseText,
                    t,
                    e
                ]);
            });
        }), this;
    };
    utils0.expr.pseudos.animated = function (e) {
        return utils0.grep(utils0.timers, function (t) {
            return e === t.elem;
        }).length;
    };
    utils0.offset = {
        setOffset: function (e, t, n) {
            var r, i, o, a, s, u, l = utils0.css(e, 'position'), c = utils0(e), f = {};
            'static' === l && (e.style.position = 'relative');
            s = c.offset();
            o = utils0.css(e, 'top');
            u = utils0.css(e, 'left');
            ('absolute' === l || 'fixed' === l) && (o + u).indexOf('auto') > -1 ? (a = (r = c.position()).top, i = r.left) : (a = parseFloat(o) || 0, i = parseFloat(u) || 0);
            h(t) && (t = t.call(e, n, utils0.extend({}, s)));
            null != t.top && (f.top = t.top - s.top + a);
            null != t.left && (f.left = t.left - s.left + i);
            'using' in t ? t.using.call(e, f) : c.css(f);
        }
    };
    utils0.fn.extend({
        offset: function (e) {
            if (arguments.length) {
                return void 0 === e ? this : this.each(function (t) {
                    utils0.offset.setOffset(this, e, t);
                });
            }
            var t, n, r = this[0];
            return r ? r.getClientRects().length ? (t = r.getBoundingClientRect(), n = r.ownerDocument.defaultView, {
                top: t.top + n.pageYOffset,
                left: t.left + n.pageXOffset
            }) : {
                top: 0,
                left: 0
            } : void 0;
        },
        position: function () {
            if (this[0]) {
                var e, t, n, r = this[0];
                if ('fixed' === utils0.css(r, 'position')) {
                    t = r.getBoundingClientRect();
                } else {
                    for (t = this.offset(), n = r.ownerDocument, e = r.offsetParent || n.documentElement; e && (e === n.body || e === n.documentElement) && 'static' === utils0.css(e, 'position');) {
                        e = e.parentNode;
                    }
                    e && e !== r && 1 === e.nodeType && ((i = utils0(e).offset()).top += utils0.css(e, 'borderTopWidth', true), 0 += utils0.css(e, 'borderLeftWidth', true));
                }
                return {
                    top: t.top - 0 - utils0.css(r, 'marginTop', true),
                    left: t.left - 0 - utils0.css(r, 'marginLeft', true)
                };
            }
        },
        offsetParent: function () {
            return this.map(function () {
                for (var e = this.offsetParent; e && 'static' === utils0.css(e, 'position');) {
                    e = e.offsetParent;
                }
                return e || ne;
            });
        }
    });
    utils0.each({
        scrollLeft: 'pageXOffset',
        scrollTop: 'pageYOffset'
    }, function (e, t) {
        var n = 'pageYOffset' === t;
        utils0.fn[e] = function (r) {
            return F(this, function (e, r, i) {
                var o;
                if (g(e) ? o = e : 9 === e.nodeType && (o = e.defaultView), void 0 === i) {
                    return o ? o[t] : e[r];
                }
                o ? o.scrollTo(n ? o.pageXOffset : i, n ? i : o.pageYOffset) : e[r] = i;
            }, e, r, arguments.length);
        };
    });
    utils0.each([
        'top',
        'left'
    ], function (e, t) {
        utils0.cssHooks[t] = We(d.pixelPosition, function (e, n) {
            if (n) {
                return n = Be(e, t), Pe.test(n) ? utils0(e).position()[t] + 'px' : n;
            }
        });
    });
    utils0.each({
        Height: 'height',
        Width: 'width'
    }, function (e, t) {
        utils0.each({
            padding: 'inner' + e,
            content: t,
            '': 'outer' + e
        }, function (n, r) {
            utils0.fn[r] = function (i, o) {
                var a = arguments.length && (n || 'boolean' != typeof i), s = n || (true === i || true === o ? 'margin' : 'border');
                return F(this, function (t, n, i) {
                    var o;
                    return g(t) ? 0 === r.indexOf('outer') ? t['inner' + e] : t.document.documentElement['client' + e] : 9 === t.nodeType ? (o = t.documentElement, Math.max(t.body['scroll' + e], o['scroll' + e], t.body['offset' + e], o['offset' + e], o['client' + e])) : void 0 === i ? utils0.css(t, n, s) : utils0.style(t, n, i, s);
                }, t, a ? i : void 0, a);
            };
        });
    });
    utils0.each([
        'ajaxStart',
        'ajaxStop',
        'ajaxComplete',
        'ajaxError',
        'ajaxSuccess',
        'ajaxSend'
    ], function (e, t) {
        utils0.fn[t] = function (e) {
            return this.on(t, e);
        };
    });
    utils0.fn.extend({
        bind: function (e, t, n) {
            return this.on(e, null, t, n);
        },
        unbind: function (e, t) {
            return this.off(e, null, t);
        },
        delegate: function (e, t, n, r) {
            return this.on(t, e, n, r);
        },
        undelegate: function (e, t, n) {
            return 1 === arguments.length ? this.off(e, '**') : this.off(t, e || '**', n);
        },
        hover: function (e, t) {
            return this.mouseenter(e).mouseleave(t || e);
        }
    });
    utils0.each('blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu'.split(' '), function (e, t) {
        utils0.fn[t] = function (e, n) {
            return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t);
        };
    });
    ;
    utils0.proxy = function (e, t) {
        var n, r, o;
        if ('string' == typeof t && (n = e[t], t = e, e = n), h(e)) {
            return r = i.call(arguments, 2), (o = function () {
                return e.apply(t || this, r.concat(i.call(arguments)));
            }).guid = e.guid = e.guid || utils0.guid++, o;
        }
    };
    utils0.holdReady = function (e) {
        e ? utils0.readyWait++ : utils0.ready(true);
    };
    utils0.isArray = Array.isArray;
    utils0.parseJSON = JSON.parse;
    utils0.nodeName = A;
    utils0.isFunction = h;
    utils0.isWindow = g;
    utils0.camelCase = z;
    utils0.type = x;
    utils0.now = Date.now;
    utils0.isNumeric = function (e) {
        var t = utils0.type(e);
        return ('number' === t || 'string' === t) && !isNaN(e - parseFloat(e));
    };
    utils0.trim = function (e) {
        return null == e ? '' : (e + '').replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
    'function' == typeof define && define.amd && define('jquery', [], function () {
        return utils0;
    });
    var zt = e.jQuery, Ut = e.$;
    return utils0.noConflict = function (t) {
        return e.$ === utils0 && (e.$ = Ut), t && e.jQuery === utils0 && (e.jQuery = zt), utils0;
    }, void 0 === t && (e.jQuery = e.$ = utils0), utils0;
});
jqGCSecurly = jQuery.noConflict(true);
const gChatPort = chrome.runtime.connect({ name: 'gchat-widget' });
var phrasesList, regexBullyArray, regexGriefArray, regexViolenceArray, gChatId, featureConfig = void 0, phraseMatchList = {
    Bully: [],
    Grief: [],
    Violence: []
}, previousStr = '', mappingDictionary = {};
let userEmail = '';
!function (e) {
    function t() {
        featureConfig && featureConfig.google_chat_flagging && (phrasesList = {
            Bully: phraseMatchList.Bully.map(e => e.Phrase),
            Grief: phraseMatchList.Grief.map(e => e.Phrase),
            Violence: phraseMatchList.Violence.map(e => e.Phrase)
        }, regexBullyArray = new RegExp('\\b' + phrasesList.Bully.join('|'), 'gim'), regexGriefArray = new RegExp('\\b' + phrasesList.Grief.join('|'), 'gim'), regexViolenceArray = new RegExp('\\b' + phrasesList.Violence.join('|'), 'gim'), phraseMatchList.Bully.forEach(e => {
            mappingDictionary[e.Phrase] = e.Confidence + '-' + e.Urgency;
        }), phraseMatchList.Grief.forEach(e => {
            mappingDictionary[e.Phrase] = e.Confidence + '-' + e.Urgency;
        }), phraseMatchList.Violence.forEach(e => {
            mappingDictionary[e.Phrase] = e.Confidence + '-' + e.Urgency;
        }), jqGCSecurly(document.body).on('keyup', 'div[role="textbox"]', function (e) {
            var t = e.target.value ? e.target.value : e.target.innerHTML, r = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
            13 != r || e.shiftKey ? previousStr = t : (previousStr.length > 0 && n(previousStr, e), previousStr = '');
        }), jqGCSecurly(document.body).on('keydown', 'div[role="textbox"]', function (e) {
            var t = e.target.value ? e.target.value : e.target.innerHTML, r = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
            13 != r || e.shiftKey ? previousStr = t : (previousStr.length > 0 && n(previousStr, e), previousStr = '');
        }), jqGCSecurly(document.body).on('click', 'div[role="button"]', function (e) {
            var t = jqGCSecurly(e.target).parents().parents().find('div[role="textbox"]');
            t.length > 0 && (typedString = t[0].innerHTML, typedString.length > 0 && setTimeout(function () {
                0 != t[0].innerHTML.length && '<br>' != t[0].innerHTML || n(typedString, e);
            }, 500));
        }));
    }
    function n(e, t) {
        let n = (e = e.toLowerCase().replace(/<[^>]*>?/gm, '').replace(/[\r\t\n]/gm, ' ').replace(/\s{2,}/g, ' ')).replace(/[^a-zA-Z0-9 ]/g, ''), i = [...n.matchAll(regexBullyArray)];
        i.length > 0 ? r(e, i, 'Bully', t) : (i = [...n.matchAll(regexGriefArray)]).length > 0 ? r(e, i, 'Grief', t) : (i = [...n.matchAll(regexViolenceArray)]).length > 0 && r(e, i, 'Violence', t);
    }
    function r(e, t, n, r) {
        const i = [];
        let o = [];
        jqGCSecurly(r.currentTarget).parents('body').find('c-wiz[data-is-user-topic]').each((e, t) => {
            var n = {
                userEmail: jqGCSecurly(t).find('div[data-hovercard-id]').data('hovercard-id') || userEmail,
                displayname: jqGCSecurly(t).find('div[data-name]').data('name') || userEmail,
                timestamp: jqGCSecurly(t).find('span[data-absolute-timestamp]').data('absolute-timestamp'),
                message: jqGCSecurly(t).find('div[data-group-synthetic-id]').parent().parent().parent().parent().text()
            };
            gChatId = jqGCSecurly(t).find('div[data-group-synthetic-id]').data('group-synthetic-id');
            n.message.length > 0 && i.push(n);
        });
        jqGCSecurly(r.currentTarget).parents('body').find('c-wiz[data-group-id="' + gChatId + '"]').find('span[data-hovercard-id]').each((e, t) => {
            var n = {
                userEmail: jqGCSecurly(t).data('hovercard-id'),
                displayname: jqGCSecurly(t).data('name')
            };
            n.userEmail.length > 0 && o.push(n);
        });
        (function (e, t, n, r, i) {
            let o = t.map(e => phraseMatchList[i].find(t => t.Phrase.toLowerCase() == e)).filter(e => void 0 !== e);
            var a = {
                chatRoomId: gChatId,
                flagged_text: e,
                matched_phrase: t.join('|'),
                context: r,
                score: function (e) {
                    let t = 0, n = 0, r = 0;
                    ;
                    try {
                        for (index in e)
                            n = i[mappingDictionary[e[index].Phrase]], r += n *= n;
                        if (r > 2000) {
                            return 1;
                        }
                        ;
                        let a = 0, s = 0, u = 0, l = 0;
                        for (const [e, t] of Object.entries(o)) {
                            const n = e.split(','), i = t.split(',');
                            r >= n[0] && r <= n[1] && (a = n[0], s = n[1], u = i[0], l = i[1]);
                        }
                        let c = Math.abs(r - a) / Math.abs(s - a);
                        t = (10 * c + 1 * u) / 100;
                    } catch (e) {
                        console.error('Error in calculating score', e);
                        t = 0;
                    }
                    return t;
                }(o),
                confidence: o.map(e => e.Confidence).join('|'),
                type_detail: i,
                chatMembers: n
            };
            ;
            ;
            ;
            ;
            ;
            ;
            ;
            ;
            gChatPort.postMessage({
                action: 'sendGoogleChatAnaltics',
                data: JSON.stringify(a)
            });
        }(e, t, o = o.filter((e, t, n) => n.findIndex(t => [
            'displayname',
            'userEmail'
        ].every(n => t[n] === e[n])) === t), i.reverse(), n));
    }
    function i() {
        gChatPort.postMessage({ action: 'fetchInitialConfiguration' });
    }
    gChatPort.onMessage.addListener(function (e) {
        'initConfig' === e.action && (featureConfig = e.featureConfig, phraseMatchList = e.phraseMatchList, userEmail = e.userEmail, setTimeout(t, 2000));
    });
    window.addEventListener ? window.addEventListener('load', i, false) : window.attachEvent && window.attachEvent('onload', i);
}(jqGCSecurly);

module.exports = {
    utils0
};
