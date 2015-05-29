/** 
 * Laro (Game Engine Based on Canvas)
 * Code licensed under the MIT License:
 *
 * @fileOverview Laro
 * @author  Hongru
 * @description
 *
 */
(function(d, b) {
	var k = {
		$name: "Laro",
		$description: "game engine based on html5"
	};
	var a = Object.prototype.toString,
		l = Array.prototype.slice,
		o = this || d;

	function n(q) {
		var p = a.call(q).toLowerCase(),
			t = 8,
			s = p.length - 1;
		return p.substring(t, s)
	}

	function g(w, t, s) {
		var v = -1,
			p = l.call(arguments, 0);
		w = o[k["$name"]] || {};
		t = [];
		s = true;
		while (p[++v]) {
			if (n(p[v]) === "boolean") {
				s = p[v]
			} else {
				if (n(p[v]) === "object") {
					t.push(p[v])
				}
			}
		}
		if (t.length >= 2) {
			w = t.splice(0, 1)[0]
		}
		for (var r = 0; r < t.length; r++) {
			var u = t[r];
			for (var q in u) {
				if (!w.hasOwnProperty(q) || s) {
					w[q] = u[q]
				}
			}
		}
		return w
	}

	function m(q, s) {
		var t = q.split("."),
			r = -1,
			p = o;
		if (t[0] == "") {
			t[0] = k["$name"]
		}
		while (t[++r]) {
			if (p[t[r]] === b) {
				p[t[r]] = {}
			}
			p = p[t[r]]
		}
		if (s) {
			if (typeof s == "function") {
				s.call(p, o[k["$name"]])
			} else {
				if (n(s) == "object") {
					g(p, s)
				}
			}
		}
	}

	function c(q, p) {
		return q + Math.random() * (p - q)
	}

	function e() {
		return Math.random() >= 0.5
	}

	function h(p, q) {
		return function() {
			typeof p == "function" && p.apply(q, arguments)
		}
	}

	function f(p, r) {
		var q = Array.prototype.slice.call(arguments, 0);
		delete q[0];
		delete q[1];
		return function() {
			typeof p == "function" && p.apply(r, q.concat(arguments))
		}
	}
	var j = {
		toType: n,
		extend: g,
		register: m,
		NS: m,
		randomRange: c,
		randomBool: e,
		curry: h,
		curryWithArgs: f
	};
	var i = g({}, k, j);
	this[k["$name"]] = d[k["$name"]] = i
})(window);
(function(f, g) {
	var e = Object.prototype.toString,
		c = Array.isArray,
		b = {};
	b.isArray = c || function(h) {
		return e.call(h) === "[object Array]"
	};
	b.isString = function(h) {
		return !!(h === "" || (h && h.charCodeAt && h.substr))
	};
	b.isObject = function(h) {
		return h === Object(h)
	};
	var d = function(i, w, j) {
		var n = -1;

		function q(y) {
			var u = y;
			if (y && y.substring(0, 4) == "url(") {
				u = y.substring(4, y.length - 1)
			}
			var s = d.registered[u];
			return (!s && (!d.__checkURLs || !d.__checkURLs[u]) && y && y.length > 4 && y.substring(0, 4) == "url(")
		}
		var m = new Array();
		if (b.isArray(i)) {
			var p = i;
			for (var x = 0; x < p.length; x++) {
				if (d.registered[p[x]] || q(p[x])) {
					m.push(p[x])
				}
			}
			i = m[0];
			n = 1
		} else {
			while (typeof(arguments[++n]) == "string") {
				if (d.registered[i] || q(i)) {
					m.push(arguments[n])
				}
			}
		}
		w = arguments[n];
		j = arguments[++n];
		if (m.length > 1) {
			var l = w;
			w = function() {
				d(m, l, j)
			}
		}
		var k = d.registered[i];
		if (!d.__checkURLs) {
			d.__checkURLs = {}
		}
		if (q(i) && i.substring(0, 4) == "url(") {
			i = i.substring(4, i.length - 1);
			if (!d.__checkURLs[i]) {
				m[0] = i;
				d.register(i, i);
				k = d.registered[i];
				var o = d.prototype.getCallbackQueue(i);
				var t = new d.prototype.curCallBack(function() {
					d.__checkURLs[i] = true
				});
				o.push(t);
				o.push(new d.prototype.curCallBack(w, j));
				w = g;
				j = g
			}
		}
		if (k) {
			for (var h = k.requirements.length - 1; h >= 0; h--) {
				if (d.registered[k.requirements[h].name]) {
					d(k.requirements[h].name, function() {
						d(i, w, j)
					}, j);
					return
				}
			}
			for (var v = 0; v < k.urls.length; v++) {
				if (v == k.urls.length - 1) {
					if (w) {
						d.load(k.name, k.urls[v], k.isAsyn, k.asyncWait, new d.prototype.curCallBack(w, j))
					} else {
						d.load(k.name, k.urls[v], k.isAsyn, k.asyncWait)
					}
				} else {
					d.load(k.name, k.urls[v], k.isAsyn, k.asyncWait)
				}
			}
		} else {
			!!w && w.call(j)
		}
	};
	d.prototype = {
		register: function(h, k, l, j) {
			var i;
			if (b.isObject(h)) {
				i = h;
				i = new d.prototype.__register(i.name, i.isAsyn, i.asyncWait, j)
			} else {
				i = new d.prototype.__register(h, k, l, j)
			}
			if (!d.registered) {
				d.registered = {}
			}
			if (d.registered[h] && window.console) {
				window.console.log('Warning: Module named "' + h + '" was already registered, Overwritten!!!')
			}
			d.registered[h] = i;
			return i
		},
		__register: function(k, j, m, l) {
			this.name = k;
			var i = 0;
			var h = arguments[++i];
			if (h && typeof h == "boolean") {
				this.isAsyn = h;
				h = arguments[++i]
			} else {
				this.isAsyn = true
			}
			if (h && typeof(h) == "number") {
				this.asyncWait = m
			} else {
				this.asyncWait = 0
			}
			this.urls = new Array();
			if (h && h.length && typeof(h) != "string") {
				this.urls = h
			} else {
				for (i = i; i < arguments.length; i++) {
					if (arguments[i] && typeof(arguments[i]) == "string") {
						this.urls.push(arguments[i])
					}
				}
			}
			this.requirements = new Array();
			this.require = function(o) {
				var p = [];
				if (Object.prototype.toString.call(o) == "[object Array]" && !!o.length) {
					p = o
				} else {
					p = Array.prototype.slice.call(arguments, 0)
				}
				for (var n = 0; n < p.length; n++) {
					this.requirements.push({
						name: p[n]
					})
				}
				return this
			};
			this.register = function(n, p, q, o) {
				return d.register(n, p, q, o)
			};
			return this
		},
		defaultAsyncTime: 10,
		load: function(i, m, k, l, h) {
			if (l == g) {
				l = d.defaultAsyncTime
			}
			if (!d.loadedscripts) {
				d.loadedscripts = new Array()
			}
			var j = d.prototype.getCallbackQueue(m);
			j.push(new d.prototype.curCallBack(function() {
				d.loadedscripts.push(d.registered[i]);
				d.registered[i] = g
			}, null));
			if (h) {
				j.push(h);
				if (j.length > 2) {
					return
				}
			}
			if (k) {
				d.asynLoadScript(i, m, l, j)
			} else {
				d.xhrLoadScript(i, m, j)
			}
		},
		xhrLoadScript: function(h, k, i) {
			var j;
			if (window.XMLHttpRequest) {
				j = new XMLHttpRequest()
			} else {
				if (window.ActiveXObject) {
					j = new ActiveXObject("Microsoft.XMLHTTP")
				}
			}
			j.onreadystatechange = function() {
				if (j.readyState == 4 && j.status == 200) {
					d.injectScript(j.responseText, h);
					d.loadProgressCallback && d.loadProgressCallback(h, k);
					if (i) {
						for (var l = 0; l < i.length; l++) {
							i[l].runCallback()
						}
					}
					d.__callbackQueue[k] = g
				}
			};
			if (i.length > 1) {
				j.open("GET", k, true)
			} else {
				j.open("GET", k, false)
			}
			j.send(null)
		},
		asynLoadScript: function(j, n, m, l) {
			var h = d.prototype.createScriptNode();
			h.setAttribute("src", n);
			if (l) {
				var i = function() {
					d.__callbackQueue[n] = g;
					for (var o = 0; o < l.length; o++) {
						l[o].runCallback()
					}
					l = new Array()
				};
				h.onload = h.onreadystatechange = function() {
					if ((!h.readyState) || h.readyState == "loaded" || h.readyState == "complete" || h.readyState == 4 && h.status == 200) {
						m > 0 ? setTimeout(i, m) : i()
					}
				}
			}
			var k = document.getElementsByTagName("head")[0];
			k.appendChild(h);
			d.loadProgressCallback && d.loadProgressCallback(j, n)
		},
		curCallBack: function(h, i) {
			this.callback = h;
			this.context = i;
			this.runCallback = function() {
				!!this.callback && (!!this.context ? this.callback.call(this.context) : this.callback())
			}
		},
		getCallbackQueue: function(i) {
			if (!d.__callbackQueue) {
				d.__callbackQueue = {}
			}
			var h = d.__callbackQueue[i];
			if (!h) {
				h = d.__callbackQueue[i] = new Array()
			}
			return h
		},
		createScriptNode: function() {
			var h = document.createElement("script");
			h.setAttribute("type", "text/javascript");
			h.setAttribute("language", "Javascript");
			return h
		},
		injectScript: function(i, l) {
			var h = d.prototype.createScriptNode();
			try {
				h.setAttribute("name", l)
			} catch (k) {}
			h.text = i;
			var j = document.getElementsByTagName("head")[0];
			j.appendChild(h)
		}
	};
	d.register = d.prototype.register;
	d.load = d.prototype.load;
	d.defaultAsyncTime = d.prototype.defaultAsyncTime;
	d.asynLoadScript = d.prototype.asynLoadScript;
	d.xhrLoadScript = d.prototype.xhrLoadScript;
	var a = function(j, h, o) {
		var q = -1,
			m = 0,
			p = [];
		if (b.isArray(j)) {
			p = j
		} else {
			while (b.isString(arguments[++q])) {
				p.push(arguments[q])
			}
			h = arguments[q];
			o = arguments[++q]
		}
		for (var n = 0, k = p.length; n < k; n++) {
			d(p[n], function() {
				m++;
				if (m == p.length) {
					!!h && h.call(o)
				}
			})
		}
	};
	Laro.extend({
		module: d,
		use: d,
		multiModule: a
	})
})(window);
Laro.register(".err", function(d) {
	function a(e) {
		this.assign(e)
	}
	a.prototype = new Error();
	a.prototype.constructor = a;
	a.prototype.assign = function(e) {
		this.message = e === undefined ? "" : e
	};

	function b(e) {
		this.assign(e)
	}
	b.prototype = new a();
	b.prototype.constructor = b;

	function c(e) {
		this.assign(e)
	}
	c.prototype = new a();
	c.prototype.constructor = c;
	this.assert = function(f, e) {
		if (!f) {
			throw new b(e)
		}
	};
	this.RuntimeException = a;
	this.AssertionError = b;
	this.Exception = c;
	Laro.extend(this)
});
Laro.register(".base", function(k) {
	var d = this,
		e = d.Class,
		i = "function",
		l = /xyz/.test(function() {
			xyz
		}) ? /\bsupr\b/ : /.*/,
		g = "prototype";

	function a(f) {
		return j.call(h(f) ? f : function() {}, f, 1)
	}

	function h(f) {
		return typeof f === i
	}

	function c(m, n, f) {
		return function() {
			var p = this.supr;
			this.supr = f[g][m];
			var o = n.apply(this, arguments);
			this.supr = p;
			return o
		}
	}

	function b(n, p, f) {
		for (var m in p) {
			if (p.hasOwnProperty(m)) {
				n[m] = h(p[m]) && h(f[g][m]) && l.test(p[m]) ? c(m, p[m], f) : p[m]
			}
		}
	}

	function j(n, q) {
		function u() {}
		u[g] = this[g];
		var r = this,
			t = new u(),
			p = h(n),
			f = p ? n : this,
			m = p ? {} : n;

		function s() {
			if (this.initialize) {
				this.initialize.apply(this, arguments)
			} else {
				q || p && r.apply(this, arguments);
				f.apply(this, arguments)
			}
		}
		s.methods = function(v) {
			b(t, v, r);
			s[g] = t;
			return this
		};
		s.methods.call(s, m).prototype.constructor = s;
		s.extend = arguments.callee;
		s[g].implement = s.statics = function(w, v) {
			w = typeof w == "string" ? (function() {
				var o = {};
				o[w] = v;
				return o
			}()) : w;
			b(this, w, r);
			return this
		};
		return s
	}
	a.noConflict = function() {
		d.Class = e;
		return this
	};
	d.Class = a;
	Laro.Class = a
});
Laro.register(".geometry", function(d) {
	var a = d.err.assert,
		b = d.base.Class;
	var c = b({
		initialize: function(i, h, e, f) {
			a(i >= 0 && i <= 255, "Pixel32 wrong --> r");
			a(h >= 0 && h <= 255, "Pixel32 wrong --> g");
			a(e >= 0 && e <= 255, "Pixel32 wrong --> b");
			this.r = i;
			this.g = h;
			this.b = e;
			this.a = f === undefined ? 255 : f;
			this.normalized = [i / 255, h / 255, e / 255, this.a > 1 ? this.a / 255 : this.a]
		},
		equal: function(e) {
			if (e instanceof c) {
				return this.r == e.r && this.g == e.g && this.b == e.b && this.a == e.a
			} else {
				return false
			}
		},
		toString: function() {
			return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.normalized[3] + ")"
		},
		rgbString: function() {
			return "rgb(" + this.r + ", " + this.g + ", " + this.b + ")"
		}
	});
	this.Pixel32 = c;
	Laro.extend(this)
});
Laro.register(".game", function(e) {
	var a = e.Class || e.base.Class,
		d = e.toType;
	var c = a(function(f, g, h) {
		if (f == undefined || d(f) != "object") {
			return
		}
		this.host = f;
		this.fsm = g;
		this.stateId = h;
		this.isSuspended = false
	}).methods({
		enter: function(g, f) {
			console.warn("no enter")
		},
		leave: function() {
			console.warn("no leave")
		},
		update: function(f) {
			console.warn("no update")
		},
		suspended: function(f) {
			console.warn("no suspended")
		},
		message: function(f) {
			console.warn("no message")
		},
		suspend: function() {
			console.warn("no suspend")
		},
		resume: function(g, f) {
			console.warn("no resume")
		},
		preload: function() {
			console.warn("no preload")
		},
		cancelPreload: function() {
			console.warn("no cancelPreload")
		},
		transition: function() {
			return false
		}
	});
	var b = c.extend(function(j, g, i, f) {
		this.stateId = j;
		var h = function() {};
		this.isSuspended = false;
		this.enter = g != null ? g : h;
		this.leave = i != null ? i : h;
		this.update = f != null ? f : h
	});
	this.BaseState = c;
	this.SimpleState = b
});
Laro.register(".game", function(f) {
	var b = f.Class || f.base.Class,
		c = f.SimpleState || f.game.SimpleState,
		d = f.BaseState || f.game.BaseState;
	var e = b(function(k, g, j) {
		if (k == undefined) {
			return
		}
		this.host = k;
		this.onStateChange = j;
		this.stateArray = [];
		for (var h = 0; h < g.length; h += 2) {
			var m = g[h],
				l = g[h + 1];
			if (l instanceof c) {
				this.stateArray[m] = l
			} else {
				this.stateArray[m] = new l(k, this, m)
			}
		}
		this.currentState = e.kNoState;
		this.numSuspended = 0;
		this.suspendedArray = [];
		this.numPreloaded = 0;
		this.preloadedArray = [];
		this.numStates = this.stateArray.length
	}).methods({
		enter: function(g, h) {
			this.setState(g, h)
		},
		leave: function() {
			this.setState(e.kNoState)
		},
		update: function(h) {
			for (var g = 0; g < this.numSuspended; g++) {
				this.stateArray[this.suspendedArray[g]].suspended(h)
			}
			if (this.currentState != e.kNoState) {
				this.stateArray[this.currentState].update(h);
				if (this.currentState != e.kNoState) {
					this.stateArray[this.currentState].transition()
				}
			}
		},
		message: function(g) {
			this.currentState != e.kNoState && this.stateArray[this.currentState].message(g)
		},
		messageSuspended: function(h) {
			for (var g = 0; g < this.numSuspended; g++) {
				this.stateArray[this.suspendedArray[g]].message(h)
			}
		},
		tryChangeState: function(k, g, j, i, h) {
			if (i == undefined) {
				i = true
			}
			if (h == undefined) {
				h = true
			}
			if (g == e.kNextState) {
				g = this.currentState + 1
			}
			if (k && (g != this.currentState || i)) {
				console.log(g);
				this.setState(g, j, h);
				return true
			}
			return false
		},
		setState: function(i, k, g) {
			if (i == e.kNextState) {
				i = this.currentState + 1
			}
			if (i == e.kNoState) {
				for (; this.numSuspended > 0; this.numSuspended--) {
					this.stateArray[this.suspendedArray[this.numSuspended - 1]].leave();
					this.stateArray[this.suspendedArray[this.numSuspended - 1]].isSuspended = false
				}
				for (; this.numPreloaded > 0; this.numPreloaded--) {
					this.stateArray[this.preloadedArray[this.numPreloaded - 1]].cancelPreload()
				}
			} else {
				if (g) {
					this.stateArray[this.currentState].suspended();
					this.stateArray[this.currentState].isSuspended = true;
					this.suspendedArray[this.numSuspended++] = this.currentState
				} else {
					if (this.currentState != e.kNoState) {
						this.stateArray[this.currentState].leave()
					}
					if (!this.stateArray[i].isSuspended) {
						for (; this.numSuspended > 0; this.numSuspended--) {
							this.stateArray[this.suspendedArray[this.numSuspended - 1]].leave();
							this.stateArray[this.suspendedArray[this.numSuspended - 1]].isSuspended = false
						}
					}
				}
			}
			for (var j = 0; j < this.numPreloaded; j++) {
				this.preloadedArray[j] != i && this.stateArray[this.preloadedArray[j]].cancelPreload()
			}
			this.numPreloaded = 0;
			this.onStateChange != undefined && this.onStateChange(this.currentState, i, k);
			var h = this.currentState;
			this.currentState = i;
			if (this.currentState != e.kNoState) {
				if (this.stateArray[this.currentState].isSuspended) {
					this.stateArray[this.currentState].resume(k, h);
					this.stateArray[this.currentState].isSuspended = false;
					--this.numSuspended
				} else {
					this.stateArray[this.currentState].enter(k, h)
				}
			}
		},
		getCurrentState: function() {
			if (this.currentState == e.kNoState) {
				return null
			}
			return this.stateArray[this.currentState]
		},
		preload: function(g) {
			this.preloadedArray[this.numPreloaded++] = g
		},
		isSuspended: function(g) {
			return this.stateArray[g].isSuspended
		}
	}).statics({
		kNoState: -1,
		kNextState: -2
	});
	var a = e.extend(function() {
		this._STRING2NUM = {}
	}).methods({
		draw: function(j) {
			for (var g = 0; g < this.numSuspended; g++) {
				this.stateArray[this.suspendedArray[g]].draw(j)
			}
			var h = this.getCurrentState();
			!!h && h.draw(j)
		},
		onMouse: function(g, k, j, h) {
			var i = this.getCurrentState();
			!!i && i.onMouse(g, k, j, h)
		},
		addState: function(g, i) {
			var h = this.stateArray.length;
			if (!i instanceof Laro.BaseState) {
				console.error("不能添加一个非状态类");
				return false
			}
			this.stateArray[h] = new i(this.host, this, h);
			this._STRING2NUM[String(g)] = h;
			return i
		},
		packageState: function(i, k, n) {
			var m = this,
				j = this.stateArray.length,
				h = (n && n instanceof Laro.BaseState) ? new n(this.host, this, j) : null;

			function g(r, o) {
				for (var p = 0; p < k.length; p++) {
					var q = typeof k[p] == "number" ? k[p] : m._STRING2NUM[k[p]];
					m.stateArray[q][r] && m.stateArray[q][r].apply(m.stateArray[q], o)
				}
				h && h[r] && h[r].apply(h, o)
			}
			var l = Laro.BaseState.extend(function() {}).methods({
				enter: function(o, p) {
					g("enter", arguments)
				},
				leave: function() {
					g("leave", arguments)
				},
				update: function(o) {
					g("update", arguments)
				},
				suspended: function(o) {
					g("suspended", arguments)
				},
				message: function(o) {
					g("message", arguments)
				},
				suspend: function() {
					g("suspend", arguments)
				},
				resume: function() {
					g("resume", arguments)
				},
				preload: function() {
					g("preload", arguments)
				},
				cancelPreload: function() {
					g("cancelPreload", arguments)
				},
				transition: function() {
					g("transition", arguments)
				}
			});
			this.addState(i, l);
			return l
		},
		setState: function(h, i, g) {
			if (typeof h == "string") {
				h = this._STRING2NUM[h]
			}
			if (typeof h != "number") {
				console.error("找不到要跳转的state");
				return
			}
			return this.supr(h, i, g)
		}
	});
	this.FSM = e;
	this.AppFSM = a;
	Laro.extend(this)
});
Laro.register(".game", function(d) {
	var a = d.base.Class || d.Class;
	window.requestAnimFrame = this.requestAnimFrame = (function() {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(f, e) {
			window.setTimeout(f, 1000 / 60)
		}
	})();
	var c = a(function(i, f) {
		var h = true,
			g = new Date();

		function e() {
			if (!h) {
				return
			}
			requestAnimFrame(e);
			var k = new Date(),
				j = (k - g) / 1000;
			if (j >= 3) {
				j = 0.25
			}
			i.call(f, j);
			g = k
		}
		this.stop = function() {
			h = false
		};
		this.resume = function() {
			h = true;
			g = new Date();
			e()
		};
		e();
		return this
	});
	var b = a(function(g, f, e) {
		this.maxTime = e;
		this.from = g;
		this.to = f;
		this.time = 0;
		this.isDone = false
	}).methods({
		update: function(e) {
			this.time = Math.min(this.time + e, this.maxTime)
		},
		draw: function(f) {
			this.isDone = this.time == this.maxTime;
			var e = new d.Pixel32(d.lerp(this.from.r, this.to.r, this.time / this.maxTime), d.lerp(this.from.g, this.to.g, this.time / this.maxTime), d.lerp(this.from.b, this.to.b, this.time / this.maxTime), d.lerp(this.from.a, this.to.a, this.time / this.maxTime));
			e.a > 0 && f.drawFillScreen(e)
		},
		reset: function() {
			this.time = 0;
			this.isDone = false
		}
	});
	this.Loop = c;
	this.ScreenTransitionFade = b;
	Laro.extend(this)
});
Laro.register(".game", function(b) {
	var a = b.Class(function(d, e, c) {
		this.url = d;
		this.loaded = false;
		this.callback = e;
		this.channels = {};
		this.currentChannel = null;
		this.genAudio();
		this.can = this.canPlayThisType();
		if (!this.can || /iP(ad|od|hone)|Linux mips/i.test(navigator.userAgent)) {
			!!this.callback && this.callback();
			return
		}
		this.bind();
		this.audio.load()
	}).methods({
		genAudio: function() {
			this.audio = new Audio();
			this.audio.src = this.url;
			this.audio.preload = "auto";
			if (this.audio.play && navigator.userAgent.toLowerCase().indexOf("msie") < 0) {
				this.audio.play();
				this.audio.pause()
			}
		},
		canPlayThisType: function(d) {
			var c = {
				mp3: "audio/mpeg;",
				m4a: "audio/aac",
				ogg: 'audio/ogg; codecs="vorbis"',
				wav: "audio/wav"
			};
			if (d == undefined) {
				d = this.url.substr(this.url.lastIndexOf(".")).replace(/\./g, "")
			}
			return !!(this.audio && this.audio.canPlayType && this.audio.canPlayType(c[d]).replace(/no/, ""))
		},
		bind: function() {
			var c = this;
			this.audio.addEventListener("loadedmetadata", function(d) {
				c.addChannel("default", 0, c.getDuration())
			}, false);
			this.audio.addEventListener("playing", function(d) {}, false);
			this.audio.addEventListener("timeupdate", function(d) {}, false);
			this.audio.addEventListener("canplaythrough", function(d) {
				c.loaded = true;
				!c.channels["default"] && c.addChannel("default", 0, c.getDuration());
				!!c.callback && c.callback()
			}, false)
		},
		update: function(c) {},
		getVolume: function() {
			return this.audio.volume
		},
		setVolume: function(c) {
			c = Math.max(0, Math.min(c, 100));
			this.audio.volume = c
		},
		haveData: function() {
			var c = this.audio.readyState;
			if (c == 1 || !c) {
				return false
			} else {
				if (c == 2 || c == 3 || c == 4 || c == 5) {
					return true
				}
			}
		},
		isPlayingChannel: function(c) {
			return !this.audio.paused && (c === this.currentChannel.name)
		},
		getDuration: function() {
			return this.audio.duration
		},
		getCurrentChannel: function() {
			return this.currentChannel
		},
		addChannel: function(c, f, d) {
			if (b.toType(c) == "object") {
				c = c.name;
				f = c.start;
				d = c.duration
			}
			var e = this.getDuration();
			if (f > e) {
				throw "Sound channel start wrong!"
			}
			if (f + d > e) {
				d = e - f
			}
			this.channels[c] = {
				start: f,
				end: (f + d),
				duration: d
			};
			return this.channels[c]
		},
		removeChannel: function(c) {
			delete this.channels[c]
		},
		pause: function() {
			this.currentChannel && clearTimeout(this.currentChannel.timer);
			return this.audio.pause()
		},
		preloadChannel: function(c) {
			this.pause();
			var d = this.channels[c];
			if (d) {
				this.audio.currentTime = d.start
			}
		},
		play: function(d, c) {
			if (!this.can) {
				return
			}
			var g = this,
				f = -1;
			if (d == undefined) {
				d = "default"
			}
			if (c == undefined) {
				c = false
			}
			if (this.currentChannel) {
				clearTimeout(this.currentChannel.timer)
			}
			if (this.haveData()) {
				var e = this.channels[d];
				clearTimeout(e.timer);
				this.audio.currentTime = e.start;
				this.audio.play();
				if (c) {
					f = setTimeout(function() {
						g.play(d, c)
					}, e.duration * 1000)
				}
				this.currentChannel = {
					name: d,
					start: e.start,
					duration: e.duration,
					end: e.end,
					isLoop: c,
					startTime: (+new Date),
					timer: f
				}
			}
		}
	}).statics({
		CAN_PLAY_TYPES: function() {
			var c = document.createElement("audio"),
				e = {},
				d = "audio/";
			if (typeof c.canPlayType === "function") {
				e._supported = Boolean(true);
				e.mp3 = c.canPlayType(d + "mpeg");
				e.wav = c.canPlayType(d + 'wav; codecs="1"');
				e.ogg = c.canPlayType(d + 'ogg; codecs="vorbis"');
				e.m4a = c.canPlayType(d + "x-m4a") || c.canPlayType(d + "aac");
				e.webm = c.canPlayType(d + 'webm; codecs="vorbis"')
			} else {
				e._supported = Boolean(0)
			}
			return e
		}()
	});
	this.Sound = a;
	b.extend({
		Sound: a
	})
});
Laro.register(".game", function(d) {
	var b = d.base.Class,
		a = d.err.assert,
		k = d.toType,
		e = d.geometry.Pixel32;
	var i = b(function(o) {
		this.name = o.name;
		this.filename = o.filename;
		this.sources = {};
		for (var m in o.sources) {
			if (o.sources.hasOwnProperty(m)) {
				var n = o.sources[m];
				this.sources[n.name] = n.data
			}
		}
	});
	var g = function(m) {
		var n = m.lastIndexOf(".");
		n = m.substr(n);
		if (/png|jpg|jpeg|gif|bmp/.test(n)) {
			return "image"
		} else {
			if (/ogg|mp3|m4a|wav/.test(n)) {
				return "sound"
			}
		}
	};
	var c = function(m) {
		return (g(m) == "image")
	};
	var h = function(m) {
		return (g(m) == "sound")
	};
	var l = b(function(m) {
		this.imagePath = m || "resources/";
		this.basePath = this.imagePath;
		this.loadedImages = {};
		this.loadedSounds = {}
	}).methods({
		loadImage: function(n) {
			var m = this.loadedImages[n];
			if (!!m) {
				return m
			}
			m = new Image();
			m.src = this.imagePath + n;
			this.loadedImages[n] = m;
			return m
		},
		preloadImages: function(s, x) {
			var w = 0,
				r = [],
				o = -1,
				v = arguments;
			if (k(s) == "array") {
				r = s
			} else {
				while (k(v[++o]) == "string") {
					r.push(v[o])
				}
				x = v[o]
			}
			var n = r.length;
			var y = function(z) {
				!!x && x(z)
			};
			var m = function() {
				w++;
				y(w / n)
			};
			var p = function() {
				console.log("an image load error")
			};
			for (var u = 0; u < n; u++) {
				var t = r[u],
					q = this.loadedImages[t];
				if (q != undefined) {
					w++;
					continue
				}
				q = new Image();
				q.src = this.imagePath + t;
				q.onload = m;
				q.onerror = p;
				this.loadedImages[t] = q
			}
			y(w / n)
		},
		preload: function(n, x) {
			var q = 0,
				s = [],
				p = -1,
				u = arguments;
			if (k(n) == "array") {
				s = n
			} else {
				while (k(u[++p]) == "string") {
					s.push(u[p])
				}
				x = u[p]
			}
			var o = s.length;
			var y = function(z) {
				!!x && x(z)
			};
			var v = function() {
				q++;
				y(q / o)
			};
			for (var t = 0; t < o; t++) {
				var m = s[t];
				if (c(m)) {
					var r = this.loadedImages[m];
					if (!!r) {
						q++;
						continue
					}
					r = new Image();
					r.src = this.basePath + m;
					r.onload = v;
					r.onerror = v;
					this.loadedImages[m] = r
				} else {
					if (h(m)) {
						var w = this.loadedSounds[m];
						if (!!w) {
							q++;
							continue
						}
						w = new d.Sound(this.basePath + m, v);
						this.loadedSounds[m] = w
					}
				}
			}
			y(q / o)
		}
	}).statics({
		getInstance: function() {
			if (l.instance === null) {
				l.instance = new l(this.imagePath)
			}
			return l.instance
		},
		instance: null
	});
	var j = b(function(p, m, o, n) {
		n = n == undefined ? null : n;
		this.image = p;
		this.shapes = m;
		this.index = o;
		this.name = n
	});
	var f = b(function(m) {
		this.baseColor = new e(m.base_r, m.base_g, m.base_b);
		this.outlineColor = new e(m.outline_r, m.outline_g, m.outline_b);
		this.size = m.size;
		this.font = m.font;
		this.outline = m.outline
	}).methods({
		getFont: function() {
			var m = [];
			m.push("normal");
			m.push(this.size + "px");
			m.push(this.font);
			return m.join(" ")
		},
		generateCanvas: function(p, o) {
			var m = document.createElement("canvas"),
				q = m.getContext("2d");
			q.font = this.getFont();
			var n = this.outline * 2;
			if (o != undefined) {
				p = this.wrapText(q, p, o);
				m.width = q.measureText(p).width + 8 + n * 2;
				m.height = (this.size + n * 4) * p.split("\n").length
			} else {
				m.width = q.measureText(p).width + 8 + n * 2;
				m.height = this.size + n * 4
			}
			q.fillStyle = this.baseColor.toString();
			q.textBaseline = "middle";
			q.textAlign = "left";
			q.font = this.getFont();
			if (n != 0) {
				q.strokeStyle = this.outlineColor.toString();
				q.lineWidth = n;
				q.strokeText(p, n, this.size / 2 + n * 2)
			}
			q.fillText(p, n, this.size / 2 + n * 2);
			return m
		},
		wrapText: function(r, q, o) {
			var m = "",
				p = q.split(" "),
				n = 0;
			while (n < p.length) {
				if (r.measureText(m + p[n]).width >= o) {
					m += "\n" + p[n]
				} else {
					if (n != 0) {
						m += " " + p[n]
					} else {
						m += p[n]
					}
				}
				n++
			}
			return m
		}
	});
	this.Atlas = i;
	this.ResourceLoader = l;
	this.Tile = j;
	this.Font = f;
	Laro.extend(this)
});
Laro.register(".action", function(d) {
	var a = d.Class || d.base.Class,
		c = d.extend;
	var b = a(function(e, f) {
		if (e.framerate == undefined) {
			e.framerate = 20
		}
		c(this, e);
		this.frames = f;
		this.animationLength = f.length / e.framerate
	}).methods({
		getEvents: function(j, i) {
			var g = [];
			for (var h = 0; h < this.events.length; h++) {
				var f = this.events[h];
				if (f.frame != undefined) {
					f.time = Math.max(0, parseInt(f.frame) - 1) / this.framerate
				}
				if (f.time >= j && f.time < i) {
					g.push(f.name)
				}
			}
			return g
		},
		getTimeForNextEvent: function(j, i) {
			var h = -1;
			for (var g = 0; g < this.events.length; g++) {
				var f = this.events[g];
				if (f.frame != undefined) {
					f.time = Math.max(0, parseInt(f.frame) - 1) / this.framerate
				}
				if (f.time > j && f.time < i) {
					if (h != -1) {
						return h
					}
					h = f.time
				}
			}
			return h
		},
		getEventsSlow: function(m, l, k, g, i) {
			var h = [],
				j, f;
			for (j = 0; j < this.events.length; j++) {
				f = this.events[j];
				if (f.frame != undefined) {
					f.time = Math.max(0, parseInt(f.frame) - 1) / this.framerate
				}
				if (f.time >= m && f.time < g) {
					h.push(f.name)
				}
			}
			for (j = 0; j < this.events.length; j++) {
				f = this.events[j];
				if (f.frame != undefined) {
					f.time = Math.max(0, parseInt(f.frame) - 1) / this.framerate
				}
				if (f.time >= k && f.time < l) {
					h.push(f.name)
				}
			}
			return h
		}
	});
	this.Animation = b;
	Laro.extend(this)
});
Laro.register(".action", function(c) {
	var a = c.Class || c.base.Class;
	var b = a(function(d, f, e) {
		if (d instanceof b) {
			d = d.animation
		}
		if (e == undefined) {
			e = false
		}
		this.animation = d;
		this.callback = f == undefined ? null : f;
		this.currentFrame = 0;
		this.time = 0;
		this.renderMirrored = e;
		this.speed = 1;
		this.start = 0;
		this.end = 1;
		this.playTo = -1;
		this.loop = true;
		this.playing = false
	}).methods({
		clone: function() {
			var d = new b(this.animation, this.callback, this.renderMirrored);
			d.start = this.start;
			d.end = this.end;
			d.time = this.time;
			return d
		},
		update: function(g) {
			if (!this.playing) {
				this.currentFrame = Math.floor(this.time * this.animation.framerate) % this.animation.nbrOfFrames;
				return
			}
			var l = this.time;
			this.time += this.speed * g;
			var f = 0.5 / this.animation.framerate;
			var j = this.animation.animationLength;
			if (this.loop) {
				if (this.speed > 0) {
					this.time = this.time >= j * this.end ? this.start * j : this.time
				} else {
					this.time = this.time <= j * this.start ? this.end * j - f : this.time
				}
			} else {
				var i;
				if (this.speed > 0) {
					i = this.playTo >= 0 ? this.playTo : this.end;
					if (this.time >= j * i) {
						this.time = j * i - f;
						this.playing = false
					}
				} else {
					i = this.playTo >= 0 ? this.playTo : this.start;
					if (this.time <= j * i) {
						this.time = j * i + f;
						this.playing = false
					}
				}
			}
			this.time = Math.max(this.time, 0);
			this.currentFrame = Math.floor(this.time * this.animation.framerate) % this.animation.nbrOfFrames;
			if (this.callback != null) {
				var k = this.playing ? this.time : (this.speed > 0 ? j * this.end : this.animation.animationLength * this.start);
				var d;
				if (l < k) {
					d = this.animation.getEvents(l, k)
				} else {
					d = this.animation.getEventsSlow(l, k, j * this.start, j * this.end, g)
				}
				if (d.length >= 2) {
					this.time = this.animation.getTimeForNextEvent(l, k);
					d = [d[0]]
				}
				for (var h = 0; h < d.length; h++) {
					this.callback(d[h], this)
				}
				if (!this.playing) {
					this.callback("stopped", this)
				}
			}
		},
		draw: function(f, d, k, j, i, g) {
			var h = this.animation.frames[this.currentFrame];
			var e = this.renderMirrored ? d - (h.textureWidth - this.animation.pivotx) : d - this.animation.pivotx;
			f.drawImage(h, e, k - this.animation.pivoty, j, false, i, g, this.renderMirrored)
		},
		mirror: function() {
			this.renderMirrored = !this.renderMirrored
		},
		play: function(d) {
			this.playTo = -1;
			if (d == undefined) {
				d = true
			}
			if (this.time >= this.end * this.animation.animationLength - 0.5 / this.animation.framerate) {
				this.time = this.start * this.animation.animationLength
			}
			this.loop = d;
			this.playing = true
		},
		playToTime: function(d) {
			this.playTo = d;
			if (this.time >= this.playTo * this.animation.animationLength - 0.5 / this.animation.framerate) {
				this.time = this.start * this.animation.animationLength
			}
			this.playing = true
		},
		playToEvent: function(d) {
			for (var f = 0; f < this.animation.events.length; f++) {
				var g = this.animation.events[f];
				if (g.name == d) {
					this.playToTime(g.time / this.animation.animationLength);
					break
				}
			}
		},
		stop: function() {
			this.playing = false
		},
		rewind: function() {
			this.time = this.start * this.animation.animationLength
		},
		gotoTime: function(d) {
			this.time = d * this.animation.animationLength
		},
		gotoEvent: function(d) {
			for (var f = 0; f < this.animation.events.length; f++) {
				var g = this.animation.events[f];
				if (g.name == d) {
					this.time = g.time;
					break
				}
			}
		},
		gotoEnd: function() {
			var d = 0.5 / this.animation.framerate;
			this.time = (this.end - d) * this.animation.animationLength
		},
		setRange: function(d, g) {
			this.start = d;
			this.end = g;
			var f = this.animation.animationLength;
			if (this.time < d * f) {
				this.time = d * f
			}
			if (this.time > g * f) {
				this.time = g * f
			}
		},
		setSpeed: function(d) {
			this.speed = d
		},
		getLength: function() {
			return this.animation.animationLength * (this.end - this.start)
		},
		getCurrentPosition: function() {
			return this.time
		},
		isStopped: function() {
			return !this.playing
		},
		setCallback: function(d) {
			this.callback = d
		}
	});
	this.AnimationHandle = b;
	Laro.extend(this)
});
Laro.register(".texture", function(d) {
	var b = d.err.assert,
		c = d.base.Class || la.Class;
	var a = c(function(g, l, k, f, m, i, h, e, j) {
		b(g instanceof HTMLImageElement || g instanceof HTMLCanvasElement, "invalid image");
		this.image = g;
		this.x = l;
		this.y = k;
		this.width = f;
		this.height = m;
		this.offsetX = i == null ? 0 : i;
		this.offsetY = h == null ? 0 : h;
		this.textureWidth = e == null ? f : e;
		this.textureHeight = j == null ? m : j;
		this.hasPadding = (i > 0) || (h > 0) || (e > f) || (j > m)
	}).methods({
		getImageWidth: function() {
			return this.image.width
		},
		getImageHeight: function() {
			return this.image.height
		}
	});
	this.ImageRegion = a;
	this.EMBImage = a;
	Laro.extend(this)
});
Laro.register(".geometry", function(d) {
	var b = this,
		a = d.base.Class;
	var c = a({
		initialize: function(e, f) {
			this.x = e;
			this.y = f
		},
		magnitudeSquared: function() {
			return this.x * this.x + this.y * this.y
		},
		magnitude: function() {
			return Math.sqrt(this.magnitudeSquared())
		},
		add: function(e) {
			this.x += e.x;
			this.y += e.y;
			return this
		},
		addNew: function(e) {
			return new c(this.x + e.x, this.y + e.y)
		},
		sub: function(e) {
			this.x -= e.x;
			this.y -= e.y;
			return this
		},
		subNew: function(e) {
			return new c(this.x - e.x, this.y - e.y)
		},
		mul: function(e) {
			this.x *= e;
			this.y *= e;
			return this
		},
		mulNew: function(e) {
			return new c(this.x * e, this.y * e)
		},
		div: function(e) {
			this.x /= e;
			this.y /= e;
			return this
		},
		divNew: function(e) {
			return new c(this.x / e, this.y / e)
		},
		equal: function(e) {
			return (this.x === e.x && this.y === e.y)
		},
		notEqual: function(e) {
			return (this.x !== e.x || this.y !== e.y)
		},
		copy: function() {
			return new c(this.x, this.y)
		}
	});
	this.Point2 = c;
	Laro.extend(this)
});
Laro.register(".geometry", function(e) {
	var c = this,
		b = e.base.Class,
		d = e.geometry.Point2;
	var a = d.extend({
		dot: function(f) {
			return this.x * f.x + this.y * f.y
		},
		cross: function(f) {
			return this.x * f.x - this.y * f.y
		},
		length: function() {
			return this.magnitude()
		},
		normalize: function() {
			var f = 1 / this.length();
			this.x *= f;
			this.y *= f;
			return this
		},
		copy: function() {
			return new a(this.x, this.y)
		}
	});
	a.zero = new a(0, 0);
	a.X = new a(1, 0);
	a.Y = new a(0, 1);
	this.Vector2 = a;
	Laro.extend(this)
});
Laro.register(".geometry", function(g) {
	this.Circle = function e(i, h) {
		this.c = i;
		this.r = h
	};
	g.Circle = this.Circle;
	var c = g.base.Class || g.Class,
		b = g.err.assert,
		a = g.geometry.Vector2,
		d = g.geometry.Point2,
		e = g.geometry.Circle || this.Circle;
	var f = c(function(i, k, h, j) {
		this.x0 = i;
		this.x1 = h;
		this.y0 = k;
		this.y1 = j;
		this.width = h - i + 1;
		this.height = j - k + 1
	}).methods({
		center: function() {
			return new a((this.x0 + this.x1 + 1) / 2, (this.y0 + this.y1 + 1) / 2)
		},
		invertBy: function(h) {
			h = h || "x";
			if (h == "x") {
				return new f(-this.x1, this.y0, -this.x0, this.y1)
			} else {
				if (h == "y") {
					return new f(this.x0, -this.y1, this.x1, -this.y0)
				}
			}
		},
		offset: function(h, i) {
			if (h instanceof a || h instanceof d) {
				h = h.x;
				i = h.y
			}
			return new f(this.x0 + h, this.y0 + i, this.x1 + h, this.y1 + i)
		},
		expand: function(i, j) {
			if (i instanceof a || i instanceof d) {
				i = i.x;
				j = i.y
			}
			return new f(this.x0 - i, this.y0 - j, this.x1 + i, this.y1 + j)
		},
		contains: function(h, j) {
			var i = h;
			if (h instanceof a || h instanceof d) {
				return this.x0 <= i.x && this.y0 <= i.y && this.x1 >= i.x && this.y1 >= i.y
			} else {
				if (h instanceof f) {
					return this.x0 <= i.x0 && this.y0 <= i.y0 && this.x1 >= i.x1 && this.y1 >= i.y1
				} else {
					return this.x0 <= h && this.y0 <= j && this.x1 >= h && this.y1 >= j
				}
			}
		},
		overlaps: function(k, j, i) {
			var l, h, m;
			if (j == undefined && i == undefined) {
				j = 0;
				i = 0
			} else {
				if (j instanceof a || j instanceof d) {
					j = j.x;
					i = j.y
				}
			}
			if (k instanceof e) {
				l = k.r;
				h = k.c.x + j;
				m = k.c.y + i;
				return this.x0 - l <= h && this.y0 - l <= m && this.x1 + l >= h && this.y1 + l >= m
			} else {
				if (k instanceof f) {
					return !(this.x0 > k.x1 + j || this.x1 < k.x0 + j || this.y0 > k.y1 + i || this.y1 < k.y0 + i)
				} else {}
			}
		},
		clip: function(h) {
			return new a(Math.max(this.x0, Math.min(this.x1, h.x)), Math.max(this.y0, Math.min(this.y1, h.y)))
		},
		copy: function() {
			return new f(this.x0, this.y0, this.x1, this.y1)
		},
		include: function(h, i) {
			if (h instanceof a || h instanceof d) {
				h = h.x;
				i = h.y
			}
			this.x0 = Math.min(this.x0, h);
			this.y0 = Math.min(this.y0, i);
			this.x1 = Math.max(this.x1, h);
			this.y1 = Math.max(this.y1, i);
			this.width = this.x1 - this.x0 + 1;
			this.height = this.y1 - this.y0 + 1
		}
	});
	this.Rectf = f;
	this.Rectangle = f;
	Laro.extend(this)
});
Laro.register(".world", function(g) {
	var b = g.base.Class || Laro.Class,
		a = g.err.assert,
		f = g.geometry.Rectf;
	var e = b(function(h) {
		if (h != undefined) {
			this.tiles = h;
			this.image = this.tiles[0].image;
			a(this.count > 0, "arguments of Layer is not enough")
		}
	}).methods({
		count: function() {
			return this.tiles.length / 5
		},
		offset: function(h) {
			return h * 5
		}
	});
	var d = e.extend(function(h, j, k, i) {
		a(j.length == k * i);
		this.indices = j;
		this.sx = k;
		this.sy = i
	}).methods({
		index: function(k, h) {
			return this.indices[k + this.sx * h]
		},
		tile: function(k, h) {
			var l = h == null ? k : this.index(k, h);
			return l == -1 ? -1 : l * 5
		},
		previous: function(k, h) {
			if (k === 0) {
				return h == 0 ? -1 : this.index(this.sx - 1, h - 1)
			} else {
				return this.index(k - 1, h)
			}
		}
	});
	var c = e.extend(function(h, i, j) {
		a(j instanceof f);
		this.rectangles = i;
		this.rect = j
	});
	this.Layer = e;
	this.TileLayer = d;
	this.SpriteLayer = c;
	Laro.extend(this)
});
Laro.register(".world", function(e) {
	var b = e.base.Class || e.Class,
		h = e.geometry.Pixel32,
		c = e.geometry.Rectf,
		a = e.err.assert,
		d = e.world.Layer,
		f = e.world.TileLayer,
		i = e.world.SpriteLayer;
	var g = b(function() {
		this.scaleFactor = 1;
		this.width = 0;
		this.height = 0;
		this.clips = [];
		this.defaultClip = null;
		this.frontToBack = false;
		this.calls = 0;
		this.maxCalls = 10000;
		this.red = new h(255, 0, 0);
		this.green = new h(0, 255, 0);
		this.blue = new h(0, 0, 255);
		this.black = new h(0, 0, 0);
		this.white = new h(255, 255, 255);
		this.transparent = new h(0, 0, 0, 0)
	}).methods({
		isFrontToBack: function() {
			return this.frontToBack
		},
		clear: function() {},
		getWidth: function() {
			return this.width
		},
		getHeight: function() {
			return this.height
		},
		getSafeRect: function() {
			return new c(0, 0, this.getWidth(), this.getHeight())
		},
		reset: function(j, k) {
			a(j > 0 && k > 0, "invalid arguments");
			this.width = j;
			this.height = k;
			this.defaultClip = new c(0, 0, j / this.scaleFactor, k / this.scaleFactor)
		},
		setScaleFactor: function(j) {
			a(j > 0, "factor wrong");
			this.scaleFactor = j;
			this.defaultClip = new c(0, 0, this.getWidth() / this.scaleFactor, this.getHeight() / this.scaleFactor)
		},
		drawLine: function(l, n, k, m, j) {},
		drawCircle: function(j, m, l, k) {},
		drawRect: function(l, n, k, m, j) {},
		drawQuad: function(k, j) {},
		drawTris: function(k, j) {},
		drawFilledRect: function(l, o, j, n, m, k) {},
		drawFilledTris: function(k, j) {},
		drawImage: function(l, j, q, p, k, o, m, n) {},
		drawTriangleImage: function(k, m, j, l) {},
		drawParticle: function(n, p, o, j, r, q, k, l, m) {},
		drawTilingImage: function(p, s, q, r, k, l) {
			var n, m, t = p.textureWidth,
				o = p.textureHeight;
			for (n = 0; n < r; n++) {
				for (m = 0; m < k; m++) {
					this.drawImage(p, s + n * t, q + m * o, 0, true, l)
				}
			}
		},
		drawLayer: function(H, q, p, v, u, G, E) {
			var z, w, I, o, m, B, s, r;
			if (H instanceof d) {
				for (w = u; w < u + E; w++) {
					var l = H.previous(v, w),
						t = H.index(v + G - 1, w);
					var k, o, m, B, s, r;
					for (z = l + 1, r = z * 5; z <= t; z++) {
						k = H.tiles[r++];
						o = H.tiles[r++];
						m = H.tiles[r++];
						B = H.tiles[r++];
						s = d.tiles[r++];
						this.drawImage(k, q + o, p + m, 0, B, 1, null, s)
					}
				}
			} else {
				if (H instanceof i) {
					var n = this.isFrontToBack();
					for (z = 0; z < H.count(); z++) {
						r = 4 * (n ? this.count() - 1 - z : z);
						var F = H.rectangles[r++],
							D = H.rectangles[r++],
							C = H.rectangles[r++],
							A = H.rectangles[r++];
						if (C >= v && F <= v + G && A >= u && D <= u + E) {
							r = 5 * (n ? H.count() - 1 - z : z);
							k = H.tiles[r++];
							o = H.tiles[r++];
							m = H.tiles[r++];
							B = H.tiles[r++];
							s = H.tiles[r++];
							this.drawImage(k, q + o, p + m, 0, B, 1, null, s)
						}
					}
				} else {
					a(false)
				}
			}
		},
		drawText: function(k, j, m, l) {},
		drawCanvas: function(k, j, l) {},
		drawSystemText: function(k, j, m, l) {},
		drawFillScreen: function(j) {},
		pushClipRect: function(j) {
			a(j instanceof c);
			this.clips.push(j)
		},
		popClipRect: function() {
			a(this.clips.length > 0, "no clip to pop");
			return this.clips.pop()
		},
		getClipRect: function() {
			if (this.clips.length == 0) {
				return this.defaultClip
			} else {
				return this.clips[this.clips.length - 1]
			}
		},
		flush: function() {
			this.calls = 0
		}
	});
	this.Render = g;
	Laro.extend(this)
});
Laro.register(".world", function(e) {
	var a = e.err.assert,
		g = e.world.Render,
		b = e.base.Class,
		i = e.toType,
		c = e.world.Layer,
		f = e.world.TileLayer,
		h = e.world.SpriteLayer;
	var d = g.extend(function(j, l, k) {
		this.canvas = j;
		this.context = this.canvas.getContext("2d");
		this.scaleFactor = i(l) == "number" ? l : 1;
		this.context.scale(this.scaleFactor, this.scaleFactor);
		this.frontToBack = k == undefined ? false : k;
		if (this.frontToBack) {
			this.context.globalCompositeOperation = "destination-over"
		}
		this.secondCanvas = document.createElement("canvas");
		this.secondContext = this.secondCanvas.getContext("2d")
	}).methods({
		getWidth: function() {
			return this.canvas.width || 800
		},
		getHeight: function() {
			return this.canvas.height || 600
		},
		drawRect: function(l, n, k, m, j) {
			l = Math.floor(l);
			n = Math.floor(n);
			k = Math.floor(k);
			m = Math.floor(m);
			this.context.lineWidth = 2;
			this.context.strokeStyle = j.toString();
			this.context.strokeRect(l, n, k - l, m - n)
		},
		drawLine: function(l, n, k, m, j) {
			l = Math.floor(l);
			n = Math.floor(n);
			k = Math.floor(k);
			m = Math.floor(m);
			this.context.lineWidth = 2;
			this.context.strokeStyle = j.toString();
			this.context.beginPath();
			this.context.moveTo(l, n);
			this.context.lineTo(k, m);
			this.context.stroke()
		},
		drawCircle: function(j, m, l, k) {
			this.context.lineWidth = 2;
			this.context.strokeStyle = k.toString();
			this.context.beginPath();
			this.context.arc(j, m, l, 0, Math.PI * 2, true);
			this.context.stroke()
		},
		drawFilledRect: function(m, o, l, n, k, j) {
			if (this.calls++ > this.maxCalls) {
				return
			}
			this.context.save();
			if (j != undefined) {
				var p = this.context.createLinearGradient(0, o, 0, n);
				p.addColorStop(0, k.toString());
				p.addColorStop(0, j.toString());
				this.context.fillStyle = p
			} else {
				this.context.fillStyle = k.toString()
			}
			this.context.fillRect(m, o, l - m, n - o);
			this.context.restore()
		},
		drawImage: function(p, r, q, k, n, l, j, s) {
			if (this.calls++ > this.maxCalls) {
				return
			}
			this.context.save();
			if (i(l) == "number" && l != 1) {
				this.context.globalAlpha = l
			}
			this.context.translate(r, q);
			var m = Math.floor(p.textureWidth / 2);
			var o = Math.floor(p.textureHeight / 2);
			if (i(k) == "number" && k != 0) {
				if (!n) {
					this.context.translate(m, o)
				}
				this.context.rotate(k);
				this.context.translate(-m, -o)
			} else {
				if (n) {
					this.context.translate(-m, -o);
					r = -m;
					q = -o
				}
			}
			if (s) {
				r = -r;
				this.context.scale(-1, 1);
				this.context.translate(-p.textureWidth, 0);
				r -= p.textureWidth
			}
			this.context.translate(p.offsetX, p.offsetY);
			r += p.offsetX;
			q += p.offsetY;
			if (!this.frontToBack) {
				this.drawEMBImage(p, r, q, k !== 0, this.context)
			}
			if (!!j && j.a != 0) {
				this.secondContext.clearRect(0, 0, this.secondCanvas.width, this.secondCanvas.height);
				if (this.secondCanvas.width != p.width) {
					this.secondCanvas.width = p.width
				}
				if (this.secondCanvas.height != p.height) {
					this.secondCanvas.height = p.height
				}
				this.secondContext.save();
				this.drawEMBImage(p, 0, 0, false, this.secondContext);
				this.secondContext.globalCompositeOperation = "source-in";
				this.secondContext.globalAlpha = j.a > 1 ? j.a / 255 : j.a;
				this.secondContext.fillStyle = j.rgbString();
				this.secondContext.fillRect(0, 0, this.secondCanvas.width, this.secondCanvas.height);
				this.secondContext.restore();
				this.context.drawImage(this.secondCanvas, 0, 0)
			}
			if (this.frontToBack) {
				this.drawEMBImage(p, r, q, k != 0, this.context)
			}
			this.context.restore()
		},
		scale: function(j) {
			return Math.ceil(j * this.scaleFactor) / this.scaleFactor
		},
		drawEMBImage: function(n, p, o, l, j) {
			if (!n.image.complete) {
				return
			}
			if (this.scaleFactor !== 1 && !l) {
				var k = this.scale(p);
				var r = this.scale(o);
				var q = this.scale(p + n.width - k);
				var m = this.scale(o + n.height - r);
				j.drawImage(n.image, n.x, n.y, n.width, n.height, k - p, r - o, q, m)
			} else {
				j.drawImage(n.image, n.x, n.y, n.width, n.height, 0, 0, n.width, n.height)
			}
		},
		drawText: function(k, j, n, m, l) {
			if (this.calls++ > this.maxCalls && !l) {
				return
			}
			this.context.save();
			if (i(m) == "number") {
				this.context.globalAlpha = m
			}
			this.context.drawImage(k, j, n);
			this.context.restore()
		},
		clear: function(j) {
			this.calls = 0;
			this.context.clearRect(0, 0, this.canvas.width / this.scaleFactor, this.canvas.height / this.scaleFactor);
			!!j && this.drawFilledRect(0, 0, this.canvas.width / this.scaleFactor, this.canvas.height / this.scaleFactor, j.toString())
		},
		drawTilingImage: function(q, t, r, s, k, m) {
			m = m == undefined ? 1 : m;
			this.context.save();
			if (m != 1) {
				this.globalAlpha = m
			}
			for (var p = 0; p < s; p++) {
				for (var n = 0; n < k; n++) {
					this.context.save();
					var o = t + q.textureWidth * p - q.textureWidth / 2;
					var l = r + q.textureHeight * n - q.textureHeight / 2;
					this.context.translate(o, l);
					this.drawEMBImage(q, o, l, false, this.context);
					this.context.restore()
				}
			}
			this.context.restore()
		},
		drawQuad: function(m, j) {
			var l = m.length - 2;
			for (var k = 0; k < m.length; k += 2) {
				this.drawLine(m[k], m[k + 1], m[l], m[l + 1], j);
				l = k
			}
		},
		drawPoly: function(k, j) {
			this.drawQuad(k, j)
		},
		drawTris: function(p, k) {
			a(p.length % 6 !== 0, "invalid points number");
			var o = p.length / 6,
				m;
			for (var j = 0; j < o; j += 6) {
				m = j + 4;
				for (var l = j; l < j + 6; l += 2) {
					this.drawLine(p[l], p[l + 1], p[m], p[m + 1], k);
					m = l
				}
			}
		},
		drawFillScreen: function(j) {
			if (this.calls++ > this.maxCalls) {
				return
			}
			this.context.fillStyle = j.toString();
			this.context.fillRect(0, 0, this.canvas.width / this.scaleFactor, this.canvas.height / this.scaleFactor)
		},
		drawSystemText: function(k, j, n, l) {
			if (l instanceof e.Font) {
				this.context.font = l.getFont();
				this.context.fillStyle = l.baseColor.toString();
				this.context.textBaseline = "middle";
				this.context.textAlign = "left";
				var m = l.outline * 2;
				if (m != 0) {
					this.context.strokeStyle = l.outlineColor.toString();
					this.context.lineWidth = m;
					this.context.strokeText(k, j, n)
				}
				this.context.fillText(k, j, n)
			} else {
				this.context.textBaseline = "middle";
				this.context.textAlign = "left";
				this.context.fillStyle = l.toString();
				this.context.fillText(k, j, n)
			}
		},
		setScaleFactor: function(j, k) {
			if (!!k) {
				this.context.scale(1 / this.scaleFactor, 1 / this.scaleFactor)
			}
			this.scaleFactor = j;
			this.context.scale(this.scaleFactor, this.scaleFactor);
			if (this.frontToBack) {
				this.context.globalCompositeOperation = "destination-over"
			}
		},
		getContext: function() {
			return this.context
		},
		drawTriangleImage: function(x, p, q, r) {
			var D = p[0];
			var m = p[1];
			var C = p[2];
			var l = p[3];
			var B = p[4];
			var k = p[5];
			var u = q[0];
			var A = q[1];
			var t = q[2];
			var z = q[3];
			var s = q[4];
			var y = q[5];
			this.context.save();
			this.context.beginPath();
			this.context.moveTo(D, m);
			this.context.lineTo(C, l);
			this.context.lineTo(B, k);
			this.context.closePath();
			this.context.clip();
			var j = u * (y - z) - t * y + s * z + (t - s) * A;
			if (j === 0) {
				return
			}
			var F = -(A * (B - C) - z * B + y * C + (z - y) * D) / j;
			var E = (z * k + A * (l - k) - y * l + (y - z) * m) / j;
			var o = (u * (B - C) - t * B + s * C + (t - s) * D) / j;
			var n = -(t * k + u * (l - k) - s * l + (s - t) * m) / j;
			var w = (u * (y * C - z * B) + A * (t * B - s * C) + (s * z - t * y) * D) / j;
			var v = (u * (y * l - z * k) + A * (t * k - s * l) + (s * z - t * y) * m) / j;
			this.context.transform(F, E, o, n, w, v);
			this.drawEMBImage(x, 0, 0, false, this.context);
			this.context.restore()
		},
		drawParticle: function(m, p, o, j, r, q, k, l, n) {
			if (this.calls++ > this.maxCalls) {
				return
			}
			this.context.save();
			this.context.translate(p, o);
			if (r != 1 || q != 1) {
				this.context.scale(r, q)
			}
			if (n) {
				this.context.globalCompositeOperation = "lighter"
			}
			this.drawImage(m, 0, 0, j, true, k, null, false);
			this.context.restore()
		},
		drawCanvas: function(k, j, l) {
			if (this.calls++ > this.maxCalls) {
				return
			}
			this.drawImage(k, j, l)
		},
		drawLayer: function(K, o, n, u, t, J, H) {
			var C, B, p;
			if (K instanceof f) {
				for (B = t; B < t + H; B++) {
					var k = K.previous(u, B),
						s = K.index(u + J - 1, B);
					var L, m, l, E, r;
					for (C = k + 1, p = C * 5; C <= s; C++) {
						if (this.calls++ > this.maxCalls) {
							continue
						}
						L = K.tiles[p++];
						m = K.tiles[p++];
						l = K.tiles[p++];
						p++;
						r = K.tiles[p++];
						var w = o + m + L.offsetX,
							v = n + l + L.offsetY,
							A = L.width,
							z = L.height;
						if (this.scaleFactor != 1) {
							w = this.scale(w);
							v = this.scale(v);
							A = this.scale(A);
							z = this.scale(z)
						}
						if (!r) {
							this.context.drawImage(L.image, L.x, L.y, L.width, L.height, w, v, A, z)
						} else {
							this.context.scale(-1, 1);
							this.context.drawImage(L.image, L.x, L.y, L.width, L.height, -(w + A), v, A, z);
							this.context.scale(-1, 1)
						}
					}
				}
			} else {
				if (K instanceof h) {
					var q = K.count;
					for (C = 0; C < q; C++) {
						p = 4 * C;
						var I = K.rectangles[p++],
							G = K.rectangles[p++],
							F = K.rectangles[p++],
							D = K.rectangles[p++];
						if (F >= u && I <= u + J && D >= t && G <= t + H) {
							if (this.calls++ > this.maxCalls) {
								continue
							}
							p = 5 * C;
							L = K.tiles[p++];
							m = K.tiles[p++];
							l = K.tiles[p++];
							E = K.tiles[p++];
							r = K.tiles[p++];
							this.drawImage(L, o + m, n + l, 0, E, 1, null, r)
						}
					}
				} else {
					a(false)
				}
			}
		},
		pushClipRect: function(j) {
			this.context.save();
			this.context.beginPath();
			this.context.moveTo(j.x0, j.y0);
			this.context.lineTo(j.x0, j.y1);
			this.context.lineTo(j.x1, j.y1);
			this.context.lineTo(j.x1, j.y0);
			this.context.lineTo(j.x0, j.y0);
			this.context.clip()
		},
		popClipRect: function() {
			this.context.restore()
		}
	});
	this.CanvasRender = d;
	Laro.extend(this)
});
Laro.register(".geometry.chaikin", function(d) {
	var c = d.geometry.Point2,
		a = d.geometry.Vector2,
		b = this;
	this.subDivide = function(h, e) {
		if (h.length) {
			do {
				var g = h.length;
				h.push(new c(h[0].x, h[0].y));
				for (var f = 0; f < g - 1; ++f) {
					var m = h[f];
					var l = h[f + 1];
					var k = new c(0.75 * m.x + 0.25 * l.x, 0.75 * m.y + 0.25 * l.y);
					var j = new c(0.25 * m.x + 0.75 * l.x, 0.25 * m.y + 0.75 * l.y);
					h.push(k);
					h.push(j)
				}
				h.push(new c(h[g - 1].x, h[g - 1].y));
				for (var f = 0; f < g; ++f) {
					h.shift()
				}
			} while (--e > 0)
		}
	};
	this.getLength = function(g) {
		var e = 0;
		var h = null;
		for (var f = 1; f < g.length; f++) {
			h = g[f].subNew(g[f - 1]);
			e += Math.sqrt(h.x * h.x + h.y * h.y)
		}
		return e
	};
	this.getPointAtLength = function(h, e) {
		if (h.length === 0) {
			return new c(0, 0)
		}
		if (h.length === 1) {
			return h[0]
		}
		var j = null;
		for (var g = 0; g !== h.length - 1; g++) {
			j = h[g + 1].subNew(h[g]);
			var f = Math.sqrt(j.x * j.x + j.y * j.y);
			if (f > e) {
				return new c(h[g].x + j.x * e / f, h[g].y + j.y * e / f)
			} else {
				e -= f
			}
		}
		return h[h.length - 1]
	};
	this.getDirAtParam = function(h, l) {
		if (h.length < 2) {
			return new c(0, 0)
		}
		var e = this.getLength(h);
		var k = l * e;
		var j = null;
		for (var g = 0; g !== h.length - 1; g++) {
			j = h[g + 1].subNew(h[g]);
			var f = Math.sqrt(j.x * j.x + j.y * j.y);
			if (f > k) {
				return j
			} else {
				k -= f
			}
		}
		return h[h.length - 1].subNew(h[h.length - 2])
	};
	this.getEvenlySpacedPoints = function(n, h, l) {
		var g = n.slice(0);
		var m = [];
		var e = null;
		this.subdivide(g, 3);
		var j = this.getLength(g);
		var k = j / (h - 1);
		m.push(g[0]);
		if (l) {
			e = this.getDirAtParam(g, 0);
			l.push(new c(-e.y, e.x))
		}
		for (var f = 1; f < h - 1; f++) {
			m.push(this.getPointAtLength(g, f * k));
			if (l) {
				e = this.getDirAtParam(g, f * k / j);
				l.push(new c(-e.y, e.x))
			}
		}
		m.push(g[g.length - 1]);
		if (l) {
			e = this.getDirAtParam(g, 1);
			l.push(new c(-e.y, e.x))
		}
		return m
	};
	Laro.extend(this)
});
Laro.register("perlin", function(a) {
	this.start = true;
	this.g1 = [];
	this.p = [];
	this.noise = function(j) {
		var c, b, h, f, d, i, g, e;
		if (this.start) {
			this.start = false;
			this.init()
		}
		var k = this.setup(j, c, b, h, f);
		d = this.s_curve(k.rx0);
		g = k.rx0 * this.g1[this.p[k.bx0]];
		e = k.rx1 * this.g1[this.p[k.bx1]];
		return a.geometry.util.lerp(g, e, d)
	};
	this.s_curve = function(b) {
		return b * b * (3 - 2 * b)
	};
	this.setup = function(e, f, d, l, k) {
		var b = 256,
			j = 255,
			h = 4096,
			c = 12,
			g = 4095,
			m = {};
		m.t = e + h;
		m.bx0 = Math.floor(m.t) & j;
		m.bx1 = (m.bx0 + 1) & j;
		m.rx0 = m.t - Math.floor(m.t);
		m.rx1 = m.rx0 - 1;
		return m
	};
	this.init = function() {
		var e = 256,
			d, c, b;
		for (d = 0; d < e; d++) {
			this.p[d] = d;
			this.g1[d] = (Math.random() * (2 * e) - e) / e
		}
		while (--d) {
			b = this.p[d];
			c = Math.floor(Math.random() * e);
			this.p[d] = this.p[c];
			this.p[c] = b
		}
		for (d = 0; d < e + 2; d++) {
			this.p[e + d] = this.p[d];
			this.g1[e + d] = this.g1[d]
		}
	}
});
Laro.register(".geometry.util", function(e) {
	var d = Array.prototype.slice,
		c = e.toType,
		a = this;
	var b = function(j, g) {
		var f = g.splice(0, 1)[0];
		for (var h = 0; h < g.length; h++) {
			if (c(g[h]) == "number") {
				f = Math[j](f, g[h])
			}
		}
		return f
	};
	this.min = Math.min;
	this.max = Math.max;
	this.clamp = function(g) {
		var f = c(g) == "array" ? g : d.call(arguments, 0),
			j = Math.min(f[0], Math.min(f[1], f[2]));
		if (f.length === 3) {
			for (var h = 0; h < f.length; h++) {
				if (f[h] === j) {
					f.splice(h, 1);
					break
				}
			}
			return Math.min(f[0], f[1])
		}
	};
	this.lerp = function(h, g, f) {
		return h + f * (g - h)
	};
	Laro.extend(this)
});
Laro.register(".input", function(d) {
	var b = this;
	var c = {
		a: 65,
		b: 66,
		c: 67,
		d: 68,
		e: 69,
		f: 70,
		g: 71,
		h: 72,
		i: 73,
		j: 74,
		k: 75,
		l: 76,
		m: 77,
		n: 78,
		o: 79,
		p: 80,
		q: 81,
		r: 82,
		s: 83,
		t: 84,
		u: 85,
		v: 86,
		w: 87,
		x: 88,
		y: 89,
		z: 90,
		"0": 48,
		"1": 49,
		"2": 50,
		"3": 51,
		"4": 52,
		"5": 53,
		"6": 54,
		"7": 55,
		"8": 56,
		"9": 57,
		blank: 32,
		backspace: 8,
		esc: 27,
		tab: 9,
		enter: 13,
		"~": 192,
		"-": 189,
		_: 189,
		"+": 187,
		"=": 187,
		"{": 219,
		"[": 219,
		"}": 221,
		"]": 221,
		"|": 220,
		":": 186,
		";": 186,
		'"': 222,
		"<": 188,
		">": 190,
		"?": 191,
		up: 38,
		down: 40,
		left: 37,
		right: 39,
		shiftKey: 16,
		ctrlKey: 17,
		altKey: 18
	};
	var a = d.Class(function(e) {
		this.target = e || window || window.document;
		this.keyHash = c;
		this.keyStatus = {};
		this.keyStack = [];
		this.keydownCallbacks = {};
		this.keyupCallbacks = {};
		this._downKey = null;
		this._upKey = null;
		this._lastKeyupTime = (+new Date);
		this.checkTime = 200;
		this.maxStackLength = 10;
		this.bind()
	}).methods({
		bind: function() {
			var e = this;
			this.target.addEventListener("keydown", function(h) {
				if (h.keyCode == 32 || h.keyCode == 37 || h.keyCode == 38 || h.keyCode == 39 || h.keyCode == 40) {
					if (h.preventDefault) {
						h.preventDefault()
					} else {
						h.returnValue = false
					}
				}
				if (!h.$keyName) {
					h.$keyName = e.getKeyName(h.keyCode)
				}
				e.keydown(h);
				for (var f in e.keydownCallbacks) {
					var g = e.keydownCallbacks[f];
					if (typeof g == "function") {
						g(h)
					}
				}
			}, false);
			this.target.addEventListener("keyup", function(h) {
				if (h.keyCode == 32 || h.keyCode == 37 || h.keyCode == 38 || h.keyCode == 39 || h.keyCode == 40) {
					if (h.preventDefault) {
						h.preventDefault()
					} else {
						h.returnValue = false
					}
				}
				e.keyup(h);
				for (var f in e.keyupCallbacks) {
					var g = e.keyupCallbacks[f];
					typeof g == "function " && g(h)
				}
			}, false)
		},
		addKeydownCallback: function(f, e) {
			this.keydownCallbacks[f] = e
		},
		addKeyupCallback: function(f, e) {
			this.keyupCallbacks[f] = e
		},
		removeKeydownCallback: function(e) {
			delete this.keydownCallbacks[e]
		},
		removeKeyupCallback: function(e) {
			delete this.keyupCallbacks[e]
		},
		getKeyName: function(f) {
			for (var e in c) {
				if (c[e] == f) {
					return e
				}
			}
			return f
		},
		keydown: function(g) {
			if (this.keyStack.length == 0 || (+new Date) - this._lastKeyupTime > this.checkTime) {
				this.resetKeyStack()
			}
			var f = this.getKeyName(g.keyCode);
			!this.key(f) && this.pushToStack(f);
			this.keyStatus[f] = true;
			this._downKey = f
		},
		keyup: function(g) {
			var f = this.getKeyName(g.keyCode);
			this.keyStatus[f] = false;
			this._upKey = f
		},
		key: function(e) {
			return !!this.keyStatus[e]
		},
		pushToStack: function(f) {
			var g = (+new Date);
			if (g - this._lastKeyupTime > this.checkTime) {
				this.resetKeyStack(g);
				return
			}
			this._lastKeyupTime = g;
			this.keyStack.push(f);
			var e = this.keyStack.length,
				h = this.keyStack;
			if (e > this.maxStackLength) {
				this.keyStack = h.splice(e - this.maxStackLength)
			}
		},
		resetKeyStack: function(e) {
			this.keyStack = [];
			this._lastKeyupTime = e || (+new Date)
		}
	}).statics({});
	this.Keyboard = a;
	d.extend({
		Keyboard: a
	})
});
(function(h) {
	var a = h.Class,
		g = h.extend,
		c = (/andriod|iphone|ipad/.test(navigator.userAgent.toLowerCase()));
	var i = a(function() {
		this.x = 0;
		this.y = 0;
		this.width = 0;
		this.height = 0;
		this.stage = null
	});
	var d = i.extend(function() {
		this.eventListener = {}
	}).methods({
		addEventListener: function(j, k) {
			if (this.eventListener[j] === null || this.eventListener[j] === undefined) {
				this.eventListener[j] = []
			}
			this.eventListener[j].push(k)
		},
		removeEventListener: function(k, l) {
			if (this.eventListener[k] === null || this.eventListener[k] === undefined) {
				return
			}
			for (var j = 0; j < this.eventListener[k].length; j++) {
				if (this.eventListener[k][j] == l) {
					delete this.eventListener[k][j];
					this.eventListener[k].splice(j, 1)
				}
			}
			if (this.eventListener[k].length === 0) {
				delete this.eventListener[k]
			}
		},
		removeAllEventListener: function(j) {
			if (this.eventListener[j] === null || this.eventListener[j] === undefined) {
				return
			}
			this.eventListener[j].splice();
			delete this.eventListener[j]
		},
		hasEventListener: function(j) {
			return (!!this.eventListener[j] && this.eventListener[j].length > 0)
		}
	});
	var f = d.extend(function() {
		this.children = [];
		this.maxWidth = 0;
		this.maxHeight = 0;
		this.hoverChildren = []
	}).methods({
		addChild: function(j) {
			if (this.maxWidth < j.x + j.width) {
				this.maxWidth = j.x + j.width
			}
			if (this.maxHeight < j.y + j.height) {
				this.maxHegiht = j.y + j.height
			}
			j.stage = this;
			this.children.push(j)
		},
		addChildAt: function(k, j) {
			if (this.maxWidth < k.x + k.width) {
				this.maxWidth = k.x + k.width
			}
			if (this.maxHeight < k.y + k.height) {
				this.maxHeight = k.y + k.height
			}
			k.stage = this;
			this.children.splice(j, 0, k)
		},
		removeChild: function(k) {
			this.children.splice(this.getChildIndex(k), 1);
			if (this.maxWidth == k.x + k.width) {
				this.maxWidth = 0;
				for (var j = 0; j < this.children.length; j++) {
					if (this.maxWidth < this.children[j].x + this.children[j].width) {
						this.maxWidth = this.children[j].x + this.children[j].width
					}
				}
			}
			if (this.maxHeight == k.y + k.height) {
				this.maxHeight = 0;
				for (var j = 0; j < this.children.length; j++) {
					if (this.maxHeight < this.children[j].y + this.children[j].height) {
						this.maxHeight = this.children[j].y + this.children[j].height
					}
				}
			}
			k.stage = null
		},
		removeChildAt: function(j) {
			this.children[j].stage = null;
			var l = this.children.splice(j, 1);
			if (this.maxWidth == l.x + l.width) {
				this.maxWidth = 0;
				for (var k = 0; k < this.children.length; k++) {
					if (this.maxWidth < this.children[k].x + this.children[k].width) {
						this.maxWidth = this.children[k].x + this.children[k].width
					}
				}
			}
			if (this.maxHeight == l.y + l.height) {
				this.maxHeight = 0;
				for (var k = 0; k < this.children.length; k++) {
					this.maxHeight = 0;
					if (this.maxHeight < this.children[k].y + this.children[k].height) {
						this.maxHeight = this.children[k].y + this.children[k].height
					}
				}
			}
		},
		getChildAt: function(j) {
			return this.children[j]
		},
		getChildIndex: function(k) {
			for (var j = 0; j < this.children.length; j++) {
				if (this.children[j] == k) {
					return j
				}
			}
			return -1
		},
		contains: function(j) {
			return (this.getChildIndex(j) != -1)
		},
		dispatchMouseEvent: function(A, C, B) {
			var r = C,
				q = B;
			var w = [];

			function z(k) {
				var j = false;
				if (!k.checkType) {
					k.checkType = "rect"
				}
				switch (k.checkType) {
					case "rect":
						j = (r > k.x && r < k.x + k.width && q > k.y && q < k.y + k.height);
						break;
					case "circle":
						if (typeof k.radius != "number") {
							throw "no radius or radius is not a number"
						}
						j = (Math.sqrt(Math.pow((r - k.x), 2) + Math.pow((q - k.y), 2)) < k.radius);
						break;
					case "poly":
						break
				}
				return j
			}
			for (var u = this.children.length - 1; u >= 0; u--) {
				var n = this.children[u];
				if (!!n.dispatchMouseEvent) {
					n.dispatchMouseEvent(A, r - n.x, q - n.y)
				}
				if (z(n)) {
					A == "mousemove" && w.length < 1 && w.push(n);
					if (n.eventListener[A] == null || n.eventListener[A] == undefined) {
						continue
					}
					for (var t = 0, v = n.eventListener[A]; t < v.length; t++) {
						v[t](r - n.x, q - n.y)
					}
					break
				}
			}
			if (A != "mousemove") {
				return
			}
			for (var s = 0; s < this.hoverChildren.length; s++) {
				var D = false;
				for (var p = 0; p < w.length; p++) {
					if (this.hoverChildren[s] == w[p]) {
						D = true
					}
				}
				if (!D) {
					if (!!this.hoverChildren[s].eventListener.mouseout) {
						for (var u = 0, l = this.hoverChildren[s]; u < l.eventListener.mouseout.length; u++) {
							l.eventListener.mouseout[u](r - l.x, q - l.y)
						}
					}
					delete this.hoverChildren[s];
					break
				}
			}
			for (var s = 0; s < w.length; s++) {
				var D = false;
				for (var p = 0; p < this.hoverChildren.length; p++) {
					if (w[s] == this.hoverChildren[p]) {
						D = true
					}
				}
				if (!D && this.hoverChildren.length < 1) {
					this.hoverChildren.push(w[s]);
					if (w[s].eventListener.mouseover) {
						for (var u = 0, o = w[s]; u < o.eventListener.mouseover.length; u++) {
							o.eventListener.mouseover[u](r - o.x, q - o.y)
						}
					}
					break
				}
			}
			this.clearHoverChildren()
		},
		clearHoverChildren: function() {
			var k = [];
			for (var j = 0; j < this.hoverChildren.length; j++) {
				if (this.hoverChildren[j] != null && this.hoverChildren[j] != undefined) {
					k.push(this.hoverChildren[j])
				}
			}
			this.hoverChildren = k
		}
	});
	var e = f.extend(function(l, n) {
		this.canvas = l;
		this.ctx = this.canvas.getContext("2d");
		this.stage = null;
		this.width = l.width;
		this.height = l.height;
		var p = window,
			o = document.documentElement,
			k = this;

		function q() {
			return {
				x: p.pageXOffset || o.scrollLeft,
				y: p.pageYOffset || o.scrollTop
			}
		}

		function r(u) {
			u = u || k.canvas;
			var t = u.offsetWidth,
				s = u.offsetHeight,
				w = u.offsetTop,
				v = u.offsetLeft;
			while (u = u.offsetParent) {
				w = w + u.offsetTop;
				v = v + u.offsetLeft
			}
			return {
				top: w,
				left: v,
				width: t,
				height: s
			}
		}
		var m = function(t, u) {
			for (var s = 0; s < u.length; s++) {
				t.addEventListener(u[s], function(w, v) {
					return function(C) {
						var D = r(),
							A = q();
						if (c) {
							C.preventDefault();
							var F = u[v] == "touchend" ? C.changedTouches[0] : C.touches[0];
							var z = F.pageX - D.left + A.x,
								E = F.pageY - D.top + A.y
						} else {
							var z = C.clientX - D.left + A.x,
								E = C.clientY - D.top + A.y
						}
						if (!!w.eventListener[u[v]]) {
							for (var B = 0; B < w.eventListener[u[v]].length; B++) {
								w.eventListener[u[v]][B](z, E)
							}
						}
						w.dispatchMouseEvent(u[v], z, E)
					}
				}(k, s), false)
			}
		};
		var j = function(t, u) {
			for (var s = 0; s < u.length; s++) {
				t.addEventListener(u[s], function(w, v) {
					return function(y) {
						if (!!w.eventListener[u[v]]) {
							for (var x = 0; x < w.eventListener[u[v]].length; x++) {
								w.eventListener[u[v]][x](y)
							}
						}
					}
				}(k, s), false)
			}
		};
		m(this.canvas, ["mousemove", "mouseup", "mousedown", "click", "mouseover", "mouseout", "mouseenter", "mouseleave", "touchstart", "touchmove", "touchend"]);
		j(this.canvas, ["keyup", "keydown", "keypress"]);
		typeof n == "function" ? n.call(this) : g(this, n || {})
	}).methods({
		onRefresh: function() {},
		getContext: function() {
			return this.ctx
		},
		dispatchUpdate: function(k) {
			this.update && this.update(k);
			for (var j = 0; j < this.children.length; j++) {
				this.children[j].dispatchUpdate(k)
			}
		},
		dispatchDraw: function(k) {
			this.draw && this.draw(k);
			for (var j = 0; j < this.children.length; j++) {
				this.ctx.translate(this.children[j].x, this.children[j].y);
				this.children[j].dispatchDraw(k);
				this.ctx.translate(-this.children[j].x, -this.children[j].y)
			}
		},
		clear: function(j, m, k, l) {
			if (j !== undefined && m !== undefined && k !== undefined && l !== undefined) {
				this.ctx.clearRect(j, m, k, l)
			} else {
				this.ctx.clearRect(0, 0, this.width, this.height)
			}
		}
	});
	var b = f.extend(function(j, k) {
		if (!(j instanceof e)) {
			throw "sprite need a stage"
		}
		this.stage = j;
		this.canvas = j.canvas;
		this.ctx = j.ctx;
		j.addChild(this);
		typeof k == "function" ? k.call(this) : g(this, k || {})
	}).methods({
		getContext: function() {
			return this.ctx
		},
		dispatchUpdate: function(k) {
			this.update && this.update(k);
			for (var j = 0; j < this.children.length; j++) {
				this.children[j].dispatchUpdate(k)
			}
		},
		dispatchDraw: function(k) {
			this.draw && this.draw(k);
			this.ctx.scale(this.width < this.maxWidth ? this.width / this.maxWidth : 1, this.height < this.maxHeight ? this.height / this.maxHeight : 1);
			for (var j = 0; j < this.children.length; j++) {
				this.ctx.translate(this.children[j].x, this.children[j].y);
				this.children[j].dispatchDraw(k);
				this.children[j].translate(-this.children[j].x, this.children[j].y)
			}
			this.ctx.scale(this.width < this.maxWidth ? this.maxWidth / this.width : 1, this.height < this.maxHeight ? this.maxHeight / this.height : 1)
		}
	});
	h.Stage = e;
	h.Sprite = b
})(Laro);
Laro.$version = 0.4;