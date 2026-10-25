// ---- Didomi consent handler ----
var didomiConsentElement = document.getElementById('has_didomi_consent');
var isDidomiEnabled = didomiConsentElement && didomiConsentElement.innerText == '1';
if (isDidomiEnabled) {
  window.didomiConsentReady = false;
  window.didomiConsentString = '';
  window.didomiGppString = '';
  window.didomiOnReady = window.didomiOnReady || [];
  window.didomiOnReady.push(async function (Didomi) {
    function captureTcfString(callback) {
      if (typeof __tcfapi === 'function') {
        __tcfapi('getTCData', 2, function (tcData, success) {
          if (success && tcData && tcData.tcString) {
            window.didomiConsentString = tcData.tcString;
          }
          if (callback) {
            callback();
          }
        });
      } else {
        if (callback) {
          callback();
        }
      }
    }

    function captureGppString(callback) {
      var userStatus = Didomi.getCurrentUserStatus();
      if (userStatus && userStatus.gpp_string) {
        window.didomiGppString = userStatus.gpp_string;
        if (callback) {
          callback();
        }
        return;
      }
      if (typeof __gpp === 'function') {
        __gpp('ping', function (data, success) {
          if (success && data && data.gppString) {
            window.didomiGppString = data.gppString;
          }
          if (callback) {
            callback();
          }
        });
      } else {
        if (callback) {
          callback();
        }
      }
    }

    function captureAllConsentStrings(callback) {
      captureTcfString(function () {
        captureGppString(function () {
          if (callback) {
            callback();
          }
        });
      });
    }

    function readStoredConsentTime() {
      try {
        var ls = window.localStorage && window.localStorage.getItem('consent_time_given');
        if (ls) return ls;
      } catch (e) { }
      var match = document.cookie.match(/(?:^|; )consent_time_given=([^;]+)/);
      return match ? match[1] : null;
    }

    function writeConsentTime(ms) {
      var value = String(ms);
      document.cookie = 'consent_time_given=' + value + '; path=/; max-age=31536000';
      try { window.localStorage && window.localStorage.setItem('consent_time_given', value); } catch (e) { }
    }

    function clearConsentTime() {
      document.cookie = 'consent_time_given=; path=/; max-age=0';
      try { window.localStorage && window.localStorage.removeItem('consent_time_given'); } catch (e) { }
    }

    function didomiOriginalConsentMs() {
      try {
        if (typeof Didomi.getCurrentUserStatus === 'function') {
          var status = Didomi.getCurrentUserStatus();
          var raw = status && (status.created || status.created_at || (status.user_status && status.user_status.created));
          if (raw) {
            var ms = typeof raw === 'number' ? raw : new Date(raw).getTime();
            if (!isNaN(ms) && ms > 0) return ms;
          }
        }
      } catch (e) { }
      return Date.now();
    }

    function signalConsentReady() {
      captureAllConsentStrings(function () {
        var consentStatus = Didomi.getUserConsentStatusForAll();
        window.didomiUserConsented = consentStatus
          && consentStatus.purposes
          && consentStatus.purposes.enabled
          && consentStatus.purposes.enabled.length > 0;

        if (window.didomiUserConsented) {
          if (!readStoredConsentTime()) {
            writeConsentTime(didomiOriginalConsentMs());
          }
        } else {
          clearConsentTime();
        }

        window.didomiConsentReady = true;
        if (typeof window.onDidomiConsentReady === 'function') {
          window.onDidomiConsentReady();
        }
      });
    }

    var consentSignaled = false;
    var safeSignalReady = function () {
      if (consentSignaled) return;
      consentSignaled = true;
      signalConsentReady();
    };

    var shouldShowNotice = false;
    if (typeof Didomi.shouldUserStatusBeCollected === 'function') {
      shouldShowNotice = Didomi.shouldUserStatusBeCollected();
    } else {
      shouldShowNotice = Didomi.shouldConsentBeCollected();
    }

    let userConsent = await window.Didomi.getCurrentUserStatus();
    let isDeclined = true;
    Object.keys(userConsent.purposes).forEach((key) => {
      if (userConsent.purposes[key].enabled) {
        isDeclined = false;
      }
    });

    if (shouldShowNotice || isDeclined) {
      Didomi.notice.show();

      Didomi.on('notice.hidden', function () {
        safeSignalReady();
        setTimeout(() => {
          window.didomiVisible = false;
          document.dispatchEvent(new CustomEvent('didomiVisibilityChanged', { detail: { visible: false } }));
        })
      });

      Didomi.on('consent.changed', function () {
        safeSignalReady();
      });

      Didomi.on('notice.shown', function () {
        window.didomiVisible = true;
        document.dispatchEvent(new CustomEvent('didomiVisibilityChanged', { detail: { visible: true } }));
      });
    } else {
      safeSignalReady();

      Didomi.on('notice.hidden', function () {
        setTimeout(() => {
          window.didomiVisible = false;
          document.dispatchEvent(new CustomEvent('didomiVisibilityChanged', { detail: { visible: false } }));
        })
      });

      Didomi.on('notice.shown', function () {
        window.didomiVisible = true;
        document.dispatchEvent(new CustomEvent('didomiVisibilityChanged', { detail: { visible: true } }));
      });
    }
  });

  // ---- innerHTML polyfill ----
  (function () {
    const originalDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');

    Object.defineProperty(Element.prototype, 'innerHTML', {
      set: function (value) {
        try {
          originalDescriptor.set.call(this, value);
        } catch (e) {
          var parser = new DOMParser();
          var doc = parser.parseFromString(value, "text/html");

          if (doc.querySelector('parsererror')) {
            console.warn('[HbbTV] innerHTML XML parse error:', doc.querySelector('parsererror').textContent);
            console.warn('[HbbTV] Safe value was:', value);
            while (this.firstChild) this.removeChild(this.firstChild);
            return;
          }

          var fragment = document.createDocumentFragment();
          while (doc.documentElement.firstChild) {
            fragment.appendChild(document.adoptNode(doc.documentElement.firstChild));
          }
          while (this.firstChild) this.removeChild(this.firstChild);
          this.appendChild(fragment);
        }
      },
      get: originalDescriptor.get,
      configurable: true,
    });
  })();

  // ---- Didomi config ----
  window.didomiConfig = {
    apiKey: "45bc0cac-837c-4445-bcfb-38d46c396898",
    notice: {
      enable: true,
    },
    // user: {
    //   country: 'FR',
    //   regionCode: 'IDF',
    // }
  };

  // ---- External scripts + main.js ----
  function loadScript(src, isAsync) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      if (isAsync) script.async = true;
      script.src = src;
      document.body.appendChild(script);
    });
  }

  loadScript('https://sdk.privacy-center.org/', true)
  loadScript('./didomiScript.js')
}
