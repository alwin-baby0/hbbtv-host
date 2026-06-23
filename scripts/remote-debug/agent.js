(function () {
  var SESSION_ID = String(Date.now());
  var SERVER_URL = 'https://enviably-twelve-purveyor.ngrok-free.dev/log';
  var FLUSH_INTERVAL = 5000;

  var batch = [];
  var original = {
    log: function () { },
    warn: function () { },
    error: function () { },
    info: function () { },
    debug: function () { },
    trace: function () { },
  };

  try {
    if (console.log) original.log = console.log.bind(console);
    if (console.warn) original.warn = console.warn.bind(console);
    if (console.error) original.error = console.error.bind(console);
    if (console.info) original.info = console.info.bind(console);
    if (console.debug) original.debug = console.debug.bind(console);
    if (console.trace) original.trace = console.trace.bind(console);
  } catch (e) { }

  function serialize(args) {
    var result = [];
    for (var i = 0; i < args.length; i++) {
      try {
        result.push(typeof args[i] === 'object' ? JSON.stringify(args[i]) : String(args[i]));
      } catch (e) {
        result.push('[unserializable]');
      }
    }
    return result;
  }

  function capture(type, args) {
    try {
      batch.push({
        type: type,
        args: serialize(Array.prototype.slice.call(args)),
        timestamp: Date.now(),
      });
    } catch (e) { }
  }

  // console overrides
  try {
    console.log = function () { try { capture('log', arguments); } catch (e) { } original.log.apply(console, arguments); };
    console.warn = function () { try { capture('warn', arguments); } catch (e) { } original.warn.apply(console, arguments); };
    console.error = function () { try { capture('error', arguments); } catch (e) { } original.error.apply(console, arguments); };
    console.info = function () { try { capture('info', arguments); } catch (e) { } original.info.apply(console, arguments); };
    if (console.debug) {
      console.debug = function () { try { capture('debug', arguments); } catch (e) { } original.debug.apply(console, arguments); };
    }
    if (console.trace) {
      console.trace = function () { try { capture('trace', arguments); } catch (e) { } original.trace.apply(console, arguments); };
    }
  } catch (e) { }

  // XHR network calls
  try {
    var originalOpen = XMLHttpRequest.prototype.open;
    var originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url) {
      try {
        this._agentMethod = method;
        this._agentUrl = url;
        this._agentT0 = Date.now();
      } catch (e) { }
      return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function () {
      try {
        var self = this;
        var method = self._agentMethod || 'XHR';
        var url = self._agentUrl || '';

        if (url.indexOf(SERVER_URL) === -1) {
          self.addEventListener('load', function () {
            try {
              var duration = Date.now() - (self._agentT0 || Date.now());
              var type = self.status >= 400 ? 'network-error' : 'network';
              capture(type, ['[xhr] ' + method + ' ' + self.status + ' ' + url + ' (' + duration + 'ms)']);
            } catch (e) { }
          });
          self.addEventListener('error', function () {
            try { capture('network-error', ['[xhr] ' + method + ' failed ' + url]); } catch (e) { }
          });
          self.addEventListener('timeout', function () {
            try { capture('network-error', ['[xhr] ' + method + ' timeout ' + url]); } catch (e) { }
          });
        }
      } catch (e) { }
      return originalSend.apply(this, arguments);
    };
  } catch (e) { }

  // fetch network calls
  try {
    if (typeof window.fetch === 'function') {
      var originalFetch = window.fetch;
      window.fetch = function (input, init) {
        var url = '';
        var method = 'GET';
        try {
          url = typeof input === 'string' ? input : (input && input.url) || String(input);
          method = (init && init.method) || (input && input.method) || 'GET';
        } catch (e) { }
        var t0 = Date.now();
        return originalFetch.apply(this, arguments).then(function (res) {
          try {
            var duration = Date.now() - t0;
            var type = res.ok ? 'network' : 'network-error';
            capture(type, ['[fetch] ' + method + ' ' + res.status + ' ' + url + ' (' + duration + 'ms)']);
          } catch (e) { }
          return res;
        }, function (err) {
          try { capture('network-error', ['[fetch] ' + method + ' failed ' + url + ' | ' + String(err)]); } catch (e) { }
          throw err;
        });
      };
    }
  } catch (e) { }

  // uncaught JS errors
  try {
    window.onerror = function (msg, src, line, col) {
      try { capture('error', ['[uncaught] ' + msg + ' | ' + src + ':' + line + ':' + col]); } catch (e) { }
    };
  } catch (e) { }

  // unhandled promise rejections
  try {
    if (window.addEventListener) {
      window.addEventListener('unhandledrejection', function (e) {
        try { capture('error', ['[unhandled rejection] ' + String(e.reason)]); } catch (e) { }
      });
    }
  } catch (e) { }

  function flush() {
    try {
      if (batch.length === 0) return;

      var payload = JSON.stringify({ sessionId: SESSION_ID, userAgent: navigator.userAgent || '', logs: batch });
      batch = [];

      var xhr = null;
      if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
      } else if (window.ActiveXObject) {
        // IE6/IE7 fallback
        try {
          xhr = new ActiveXObject('Msxml2.XMLHTTP');
        } catch (e) {
          try {
            xhr = new ActiveXObject('Microsoft.XMLHTTP');
          } catch (e2) {
            return; // XMLHttpRequest not available
          }
        }
      }

      if (!xhr) return;

      xhr.open('POST', SERVER_URL, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(payload);
    } catch (e) { }
  }

  try {
    setInterval(flush, FLUSH_INTERVAL);
  } catch (e) { }
})();
