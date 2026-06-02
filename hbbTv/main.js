// Add a flag at the top of your script
var videoInitialized = false;

// VOD overlay state
var vodOverlayShown = false;

// HbbTV application object
var hbbtvApp = null;

// Debug and logging variables (for old browser compatibility)
var DEBUG_SMARTCLIP = false;
var DEBUG_ENABLED = false;  // Master switch for all debugging
var DEBUG_CONSOLE_OVERLAY = false;  // Enable on-screen console overlay display
var ENABLE_INIT_LOGGING = false;  // Enable initialization step logging to Laravel API

const TYPE = { BROADCAST: 'broadcast', APP: 'app' }
var playerType = 'dash'
var currentObject = TYPE.BROADCAST
var ssaiEnabled = false
var ssaiEnabledFullManifestUrl = ''
var ssaiDisabledFullManifestUrl = ''
var hls = undefined
var dash = undefined

var debugLog = function () {
  // Safe console.log wrapper for old browsers
  if (typeof console !== 'undefined' && console.log) {
    try {
      console.log.apply(console, arguments);
    } catch (e) {
      // Ignore console errors in old browsers
    }
  }
};

// ============================================================================
// ERROR LOGGING SYSTEM (IE8+ Compatible)
// ============================================================================
(function () {
  var errorCache = {}; // Simple debounce cache to prevent duplicate error submissions
  var ERROR_LOG_ENDPOINT = null; // Will be set after baseUrl is available

  /**
   * Send error to server API endpoint
   * Uses XMLHttpRequest for IE8+ compatibility
   */
  function sendErrorToServer(errorData) {
    // Wait for baseUrl to be available (it's defined later in the script)
    if (!ERROR_LOG_ENDPOINT) {
      // Try to get baseUrl from DOM element
      var baseUrlElement = document.getElementById('baseUrl');
      if (baseUrlElement && baseUrlElement.innerText) {
        ERROR_LOG_ENDPOINT = baseUrlElement.innerText + '/api/hbbtv-storeErrors';
      } else {
        // baseUrl not available yet, will retry on next error
        return;
      }
    }

    // Get slug from DOM
    var slug = 'unknown';
    var slugElement = document.getElementById('slug');
    if (slugElement && slugElement.innerText) {
      slug = slugElement.innerText;
    }

    // Create error signature for debouncing (prevent duplicate submissions)
    var errorSignature = errorData.error_type + ':' + errorData.message + ':' + errorData.line;
    var now = new Date().getTime();

    // Check if we recently sent this exact error (within 10 seconds)
    if (errorCache[errorSignature] && (now - errorCache[errorSignature]) < 10000) {
      return; // Skip duplicate error
    }

    // Update cache
    errorCache[errorSignature] = now;

    // Prepare payload
    var payload = {
      slug: slug,
      error_type: errorData.error_type,
      message: errorData.message,
      url: errorData.url || window.location.href,
      line: errorData.line || null,
      column: errorData.column || null,
      stack: errorData.stack || null,
      user_agent: navigator.userAgent || null,
      timestamp: new Date().toISOString()
    };

    // Create XMLHttpRequest (IE8+ compatible)
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

    try {
      xhr.open('POST', ERROR_LOG_ENDPOINT, true);
      xhr.setRequestHeader('Content-Type', 'application/json');

      // IE8/9 doesn't support xhr.onerror, so we just use onreadystatechange
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          // Request complete (success or failure) - we don't need to do anything
        }
      };

      // Convert payload to JSON string (IE8+ compatible)
      var jsonString = JSON.stringify(payload);
      xhr.send(jsonString);
    } catch (e) {
      // Silent fail - don't want error logging to cause more errors
    }
  }

  // ========================================================================
  // 1. RUNTIME ERROR HANDLER (window.onerror)
  // ========================================================================
  // Captures JavaScript runtime errors, syntax errors, etc.
  var originalOnError = window.onerror;
  window.onerror = function (message, source, lineno, colno, error) {
    var errorData = {
      error_type: 'runtime',
      message: message || 'Unknown error',
      url: source || null,
      line: lineno || null,
      column: colno || null,
      stack: error && error.stack ? error.stack : null
    };

    sendErrorToServer(errorData);

    // Call original handler if it exists
    if (originalOnError) {
      return originalOnError.apply(this, arguments);
    }

    return false; // Prevent default browser error handling
  };

  // ========================================================================
  // 2. RESOURCE LOAD ERROR HANDLER
  // ========================================================================
  // Captures errors when resources (images, scripts, videos) fail to load
  // Uses event capturing (third parameter = true) to catch events during capture phase
  if (window.addEventListener) {
    window.addEventListener('error', function (event) {
      // Check if this is a resource loading error (not a runtime error)
      var target = event.target || event.srcElement;
      if (target && target.tagName) {
        var tagName = target.tagName.toLowerCase();

        // Only log resource loading errors (img, script, link, video, audio, etc.)
        if (tagName === 'img' || tagName === 'script' || tagName === 'link' ||
          tagName === 'video' || tagName === 'audio' || tagName === 'source') {

          var resourceUrl = target.src || target.href || 'unknown';

          var errorData = {
            error_type: 'resource',
            message: 'Failed to load ' + tagName + ': ' + resourceUrl,
            url: resourceUrl,
            line: null,
            column: null,
            stack: null
          };

          sendErrorToServer(errorData);
        }
      }
    }, true); // true = use capture phase
  } else if (window.attachEvent) {
    // IE8 fallback - attachEvent doesn't support capture phase, so we handle it differently
    // Note: This won't catch all resource errors in IE8, but will catch some
    window.attachEvent('onerror', function () {
      // Already handled by window.onerror above
    });
  }

  // ========================================================================
  // 3. UNHANDLED PROMISE REJECTION HANDLER
  // ========================================================================
  // Captures unhandled Promise rejections (modern browsers only)
  // Gracefully degrades if Promises are not supported (IE11 and below)
  if (window.addEventListener && typeof Promise !== 'undefined') {
    window.addEventListener('unhandledrejection', function (event) {
      var reason = event.reason;
      var message = 'Unhandled Promise Rejection';

      if (reason) {
        if (typeof reason === 'string') {
          message = reason;
        } else if (reason.message) {
          message = reason.message;
        } else if (reason.toString) {
          message = reason.toString();
        }
      }

      var errorData = {
        error_type: 'promise',
        message: message,
        url: null,
        line: null,
        column: null,
        stack: reason && reason.stack ? reason.stack : null
      };

      sendErrorToServer(errorData);
    });
  }
  // If Promises are not supported, this handler simply won't be attached (graceful degradation)

})();

// ============================================================================
// INITIALIZATION STEP LOGGING SYSTEM (IE8+ Compatible)
// ============================================================================
(function () {
  var INIT_LOG_ENDPOINT = null; // Will be set after baseUrl is available
  var initStepCounter = 0; // Auto-increment step counter

  /**
   * Log initialization step to server API endpoint
   * @param {string} stepName - Name of the initialization step
   * @param {string} status - Status: 'success', 'failure', 'started'
   * @param {string} details - Optional details about the step
   */
  window.logInitStep = function (stepName, status, details) {
    // Check if logging is enabled
    if (!ENABLE_INIT_LOGGING) {
      return; // Logging disabled, exit early
    }

    // Wait for baseUrl to be available
    if (!INIT_LOG_ENDPOINT) {
      var baseUrlElement = document.getElementById('baseUrl');
      if (baseUrlElement && baseUrlElement.innerText) {
        INIT_LOG_ENDPOINT = baseUrlElement.innerText + '/api/hbbtv-storeInitLogs';
      } else {
        // baseUrl not available yet, skip this log
        return;
      }
    }

    // Get slug from DOM
    var slug = 'unknown';
    var slugElement = document.getElementById('slug');
    if (slugElement && slugElement.innerText) {
      slug = slugElement.innerText;
    }

    // Increment step counter
    initStepCounter++;

    // Prepare payload
    var payload = {
      slug: slug,
      step_number: initStepCounter,
      step_name: stepName,
      status: status,
      details: details || '',
      timestamp: new Date().toISOString()
    };

    // Create XMLHttpRequest (IE8+ compatible)
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

    try {
      xhr.open('POST', INIT_LOG_ENDPOINT, true);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          // Request complete - silent (don't log about logging)
        }
      };

      var jsonString = JSON.stringify(payload);
      xhr.send(jsonString);
    } catch (e) {
      // Silent fail - don't want logging to cause errors
    }
  };
})();

// Global variables that may be set dynamically
var dash_link_fast = '';
var expire_tcf_string = '';

var dash_link = document.getElementById('dash_link').innerText;
var lang = document.getElementById('lang').innerText;
var baseUrl = document.getElementById('baseUrl').innerText;
var distId = document.getElementById('distId').innerText;
var amteccoAnalytics = baseUrl + '/api/hbbtv-storeAnalytics';
var amteccoQuarileAnalytics = baseUrl + '/api/hbbtv-storeQuartiles';
var amteccoIp = baseUrl + '/api/hbbtv-ip';
var amteccoApi = baseUrl + '/api/hbbtv-api';
var dashFailureLog = baseUrl + '/api/dash/log-failure';

var ta_id = 0;
var broadcastContainer = null;
var ipAddr = null;
var ipData = null;
var width = window.innerWidth;
var height = window.innerHeight;
var objURL = null;
var adDuration = 0;
var allowAds = true;
var impression_pixel = null;
var tracking_events = [];

var uniqid = null;
var adsLoaded = 0;
var adsPlayed = 0;
var adsSkipped = 0;

// SmartClip ad tracking variables
var smartclipAdsShown = 0;
var smartclipAdsCompleted = 0;
var smartclipAdDuration = 0;
var smartclipAdData = [];
var currentSmartclipAd = null;

var consentData = '';
var consentString = '';

var loadInit = false;

// AWS MediaTailor session variables
var mediaTailorSessionUrl = null;
var mediaTailorTrackingUrl = null;

/**
 * Helper function to clone objects for old browser compatibility
 * Replaces ES6 spread operator {...obj}
 */
function cloneObject(obj) {
  if (!obj) return null;
  var clone = {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = obj[key];
    }
  }
  return clone;
}

/**
 * Calculate stagger index based on uniqid hash
 * Uses a simple hash function to deterministically assign viewers to stagger buckets
 * @param {string} id - The unique viewer ID
 * @param {number} numStaggers - Total number of staggers
 * @returns {number} - Stagger index (0 to numStaggers-1)
 */
function getStaggerIndex(id, numStaggers) {
  var hash = 0;
  for (var i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash) % numStaggers;
}

/**
 * Initialize AWS MediaTailor session for SSAI
 * Converts /v1/dash/, /v1/hls/, or /v1/master/ to the /v1/session/ endpoint
 * @param {string} manifestUrl - The base manifest URL
 * @param {string} adsParams - Query string with ads.* parameters (no leading ?)
 * @param {function} callback - Called with final manifest URL
 */
function initMediaTailorSession(manifestUrl, adsParams, callback) {
  // Extract base URL (protocol + host) from manifest URL for later use
  // e.g., "https://d82fae046moue.cloudfront.net" from full URL
  var baseUrl = '';
  console.log('### manifestUrl', manifestUrl);

  var urlMatch = manifestUrl.match(/^(https?:\/\/[^\/]+)/);
  if (urlMatch) {
    baseUrl = urlMatch[1];
  }

  // Convert manifest URL to session URL. AWS MediaTailor:
  //   DASH manifest → /v1/dash/.../channel.mpd
  //   HLS manifest  → /v1/master/.../channel.m3u8
  // /v1/hls/ doesn't fire for AWS today but stays in the list to defend
  // against any non-AWS SSAI integration that uses that shape.
  var sessionUrl = manifestUrl.replace(/\/v1\/(?:dash|hls|master)\//, '/v1/session/');

  if (DEBUG_ENABLED) debugLog('SSAI: Initializing MediaTailor session: ' + sessionUrl);

  // Create XMLHttpRequest (IE8+ compatible)
  var xhr = null;
  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    try {
      xhr = new ActiveXObject('Msxml2.XMLHTTP');
    } catch (e) {
      try {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
      } catch (e2) {
        if (DEBUG_ENABLED) debugLog('SSAI: XMLHttpRequest not available, falling back');
        callback(manifestUrl + '?' + adsParams);
        return;
      }
    }
  }

  if (!xhr) {
    callback(manifestUrl + '?' + adsParams);
    return;
  }

  // Session endpoint uses POST with JSON body
  xhr.open('POST', sessionUrl, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Accept', 'application/json');
  console.log('### sessionUrl', sessionUrl);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          var response = JSON.parse(xhr.responseText);
          console.log('### res', response);

          mediaTailorSessionUrl = response.manifestUrl;
          mediaTailorTrackingUrl = response.trackingUrl;

          // If manifest URL is relative (starts with /), prepend the base URL
          var fullManifestUrl = mediaTailorSessionUrl;
          if (mediaTailorSessionUrl && mediaTailorSessionUrl.charAt(0) === '/' && baseUrl) {
            fullManifestUrl = baseUrl + mediaTailorSessionUrl;
          }
          ssaiEnabled = true
          ssaiEnabledFullManifestUrl = fullManifestUrl

          if (DEBUG_ENABLED) {
            debugLog('SSAI: Session initialized successfully');
            debugLog('SSAI: Manifest URL (raw): ' + mediaTailorSessionUrl);
            debugLog('SSAI: Manifest URL (full): ' + fullManifestUrl);
            debugLog('SSAI: Tracking URL: ' + mediaTailorTrackingUrl);
          }
          callback(fullManifestUrl);
        } catch (e) {
          if (DEBUG_ENABLED) debugLog('SSAI: Failed to parse session response, falling back to implicit');
          ssaiDisabledFullManifestUrl = manifestUrl + '?' + adsParams
          callback(manifestUrl + '?' + adsParams);
        }
      } else {
        if (DEBUG_ENABLED) debugLog('SSAI: Session init failed (status ' + xhr.status + '), falling back to implicit');
        ssaiDisabledFullManifestUrl = manifestUrl + '?' + adsParams
        callback(manifestUrl + '?' + adsParams);
      }
    }
  };

  // Build POST body with adsParams as JSON object
  var adsParamsObj = {};
  var pairs = adsParams.split('&');
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split('=');
    if (pair.length === 2) {
      // Remove 'ads.' prefix and decode value
      var key = pair[0].replace('ads.', '');
      var value = decodeURIComponent(pair[1]);
      adsParamsObj[key] = value;
    }
  }

  var postBody = JSON.stringify({
    adsParams: adsParamsObj,
    reportingMode: "server"
  });

  if (DEBUG_ENABLED) debugLog('SSAI: POST body: ' + postBody);
  console.log('### postBody', postBody);

  xhr.send(postBody);
}

/**
 * Initialize console overlay for on-screen debugging
 * Creates a transparent overlay that displays console.log() output on the TV screen
 */
function initConsoleOverlay() {
  if (!DEBUG_CONSOLE_OVERLAY) return;

  // Create overlay HTML elements
  var overlayDiv = document.createElement('div');
  overlayDiv.id = 'console-overlay';

  var contentDiv = document.createElement('div');
  contentDiv.id = 'console-content';

  overlayDiv.appendChild(contentDiv);
  document.body.appendChild(overlayDiv);

  // Initialize console overlay functionality
  var consoleOverlay = document.getElementById('console-overlay');
  var consoleContent = document.getElementById('console-content');
  var originalConsoleLog = console.log;
  var isOverlayVisible = false;

  // Override console.log to capture output
  console.log = function () {
    // Call original console.log first
    originalConsoleLog.apply(console, arguments);

    // Only display in overlay if debug is enabled
    if (!DEBUG_ENABLED) return;

    // Format arguments for display (old browser compatible)
    var message = Array.prototype.slice.call(arguments).map(function (arg) {
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg, null, 2);
        } catch (e) {
          return '[Object object]';
        }
      }
      return String(arg);
    }).join(' ');

    // Add timestamp
    var timestamp = new Date().toLocaleTimeString();
    var logEntry = '[' + timestamp + '] ' + message + '\n';

    // Add to overlay content
    consoleContent.textContent += logEntry;

    // Auto-scroll to bottom
    consoleContent.scrollTop = consoleContent.scrollHeight;

    // Show overlay if hidden
    if (!isOverlayVisible) {
      showConsoleOverlay();
    }
  };

  // Function to show overlay
  function showConsoleOverlay() {
    consoleOverlay.style.display = 'block';
    isOverlayVisible = true;
  }

  // Function to hide overlay
  function hideConsoleOverlay() {
    consoleOverlay.style.display = 'none';
    isOverlayVisible = false;
  }

  // Function to toggle overlay
  function toggleConsoleOverlay() {
    if (isOverlayVisible) {
      hideConsoleOverlay();
    } else {
      showConsoleOverlay();
    }
  }

  // Function to clear console
  function clearConsole() {
    consoleContent.textContent = '';
  }

  // Make functions globally available for HbbTV remote control
  window.showConsoleOverlay = showConsoleOverlay;
  window.hideConsoleOverlay = hideConsoleOverlay;
  window.toggleConsoleOverlay = toggleConsoleOverlay;
  window.clearConsole = clearConsole;

  // Add initial message
  debugLog('Console overlay initialized. Use toggleConsoleOverlay() to show/hide.');
}

/**
 * Send analytics data to server
 */
function sendAnalytics() {
  console.log('### Analytics mocked and returned');
  return

  var xhr = new XMLHttpRequest();
  xhr.open('POST', amteccoAnalytics, true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  // Get stagger info for analytics
  var stagger_count_el = document.getElementById('stagger_count');
  var stagger_count = stagger_count_el ? parseInt(stagger_count_el.innerText, 10) : 0;
  var stagger_index = (stagger_count > 0 && uniqid) ? getStaggerIndex(uniqid, stagger_count) : null;

  var data = {
    uniqid: uniqid,
    distId: distId,
    userAgent: navigator.userAgent,
    ipAddr: ipAddr,
    latitude: ipData && ipData.ipData ? (ipData.ipData.lat || ipData.ipData.latitude || null) : null,
    longitude: ipData && ipData.ipData ? (ipData.ipData.lon || ipData.ipData.longitude || null) : null,
    adsLoaded: adsLoaded,
    adsPlayed: adsPlayed,
    adsSkipped: adsSkipped,
    // Stagger distribution tracking
    stagger_index: stagger_index,
    stagger_count: stagger_count > 0 ? stagger_count : null,
    // SmartClip analytics data
    smartclip: {
      adsShown: smartclipAdsShown,
      adsCompleted: smartclipAdsCompleted,
      totalDuration: smartclipAdDuration,
      currentAd: currentSmartclipAd,
      adHistory: smartclipAdData.slice(-5) // Send last 5 ads to avoid payload being too large
    }
  };

  xhr.send(JSON.stringify(data));
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var res = JSON.parse(xhr.responseText);
        debugLog('Analytics sent successfully');
        return res;
      } else {
        debugLog('Failed to send analytics, status: ' + xhr.status);
      }
    }
  };
}

/**
 * Get IP and geolocation data from server
 */
function getIpData() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', amteccoIp + '?distId=' + distId, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var res = JSON.parse(xhr.responseText);
        res.userAgent = navigator.userAgent;
        ipData = res;

        // Extract the IP address from the response
        if (ipData && ipData.ipData && ipData.ipData.ip) {
          ipAddr = ipData.ipData.ip;
        }

        if (ipData) {
          debugLog('IP data received:', ipData);

          // Send initial analytics
          sendAnalytics();

          // Set up 60-second interval for analytics updates
          setInterval(function () {
            sendAnalytics();
          }, 60000);
        }

        return res;
      } else {
        var res = {
          "ipData": {
            "ip": "213.211.234.22",
            "country": "Germany",
            "countryCode": "DE",
            "region": "Saxony-Anhalt",
            "regionCode": "ST",
            "city": "Magdeburg",
            "zip": "39106",
            "lat": "52.1426",
            "latitude": "52.1426",
            "lon": "11.6462",
            "longitude": "11.6462",
            "timezone": "Europe\/Berlin",
            "isp": null
          },
          "userAgent": "Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/148.0.0.0 Safari\/537.36",
          "distId": "3",
          "uniqid": null
        }
        res.userAgent = navigator.userAgent;
        ipData = res;

        // Extract the IP address from the response
        if (ipData && ipData.ipData && ipData.ipData.ip) {
          ipAddr = ipData.ipData.ip;
        }

        if (ipData) {
          debugLog('IP data received:', ipData);

          // Send initial analytics
          sendAnalytics();

          // Set up 60-second interval for analytics updates
          setInterval(function () {
            sendAnalytics();
          }, 60000);
        }
        return res;
        debugLog('Failed to get IP data, status: ' + xhr.status);
      }
    }
  };
}

/**
 * Function to match DASH video player to broadcast element dimensions
 * Used when SmartClip L-banner ads are displayed to resize video accordingly
 */
function matchVideoToBroadcast() {
  // Get the broadcast element
  var broadcast = document.getElementById('broadcast-video');
  if (!broadcast) {
    debugLog('Broadcast element not found');
    return;
  }

  // Get the DASH video element
  var video = document.getElementById('video');
  if (!video) {
    debugLog('DASH video element not found');
    return;
  }

  // Get broadcast element's current computed styles
  var computedBroadcast = window.getComputedStyle(broadcast);

  // Copy exact dimensions and position from broadcast to video
  video.style.width = computedBroadcast.width;
  video.style.height = computedBroadcast.height;
  video.style.position = 'absolute';
  video.style.left = computedBroadcast.left;
  video.style.top = computedBroadcast.top;

  // Ensure video stays visible - set z-index higher than broadcast
  var broadcastZIndex = parseInt(computedBroadcast.zIndex) || 0;
  video.style.zIndex = (broadcastZIndex + 10).toString();

  // Log the synchronization for debugging
  debugLog('Video synchronized to broadcast:', {
    width: computedBroadcast.width,
    height: computedBroadcast.height,
    left: computedBroadcast.left,
    top: computedBroadcast.top,
    zIndex: video.style.zIndex
  });
}

/**
 * Initialize RTL (SmartClip L-banner ad insertion system)
 * Sets up the SMARTNS namespace and event callbacks for ad tracking
 */
function setRtl() {
  if (DEBUG_ENABLED) debugLog('=== RTL: Initializing SmartClip ===');

  window.SMARTNS = window.SMARTNS || {};
  if (DEBUG_ENABLED) debugLog('RTL: SmartClip namespace created');

  // Read the persisted opt-in timestamp. localStorage is the primary store
  // because HbbTV devices routinely drop session cookies across reboots;
  // the cookie is a secondary fallback for browsers without localStorage.
  function readStoredOptInMs() {
    try {
      var ls = window.localStorage && window.localStorage.getItem('consent_time_given');
      if (ls) return ls;
    } catch (e) { }
    var match = document.cookie.match(/(?:^|; )consent_time_given=([^;]+)/);
    return match ? match[1] : null;
  }

  // Get consent state for SmartClip ads. Returns a stable, persisted
  // timestamp captured at the moment of original opt-in — NEVER the current
  // time — because Smartclip blocks ads until consent is >= 24h old.
  window.SMARTNS.getOptState = function () {
    var optState = "unset";
    var has_didomi = document.getElementById('has_didomi_consent');
    var isConsented;

    if (has_didomi && has_didomi.innerText == '1') {
      isConsented = window.didomiConsentReady && window.didomiUserConsented === true;
    } else {
      isConsented = consentString && consentString.length > 3;
    }

    if (isConsented) {
      var stored = readStoredOptInMs();
      // Fail closed: if we're consented but have no stored stamp, treat as
      // opted-out rather than fabricating a fresh timestamp (which was the
      // original bug that permanently blocked Smartclip ad delivery).
      optState = stored ? stored : "out";
    } else {
      optState = "out";
    }

    if (DEBUG_ENABLED) debugLog('RTL: Consent state = ' + optState);
    return optState;
  };

  // SmartClip ad event callbacks for analytics
  window.SMARTNS.onAdShow = function (adData) {
    if (DEBUG_ENABLED) debugLog('RTL: === AD SHOWING ===', adData);
    debugLog('SmartClip ad showing:', adData);
    smartclipAdsShown++;

    // Synchronize DASH video to broadcast dimensions when ad shows
    var has_player = document.getElementById('has_player');
    if (has_player && has_player.innerText === '1') {
      debugLog('SmartClip ad starting - synchronizing DASH player to broadcast...');
      // Wait for broadcast element to resize (based on logs, this happens after bindToCurrentChannel)
      setTimeout(function () {
        matchVideoToBroadcast();
      }, 150); // Slightly longer delay to ensure broadcast has resized
    }

    // Create ad tracking object with old browser compatible property access
    currentSmartclipAd = {
      id: (adData && adData.id) || 'unknown',
      title: (adData && adData.title) || 'unknown',
      duration: (adData && adData.duration) || 0,
      creativeUrl: (adData && adData.creativeUrl) || '',
      impressionUrl: (adData && adData.impressionUrl) || '',
      clickUrl: (adData && adData.clickUrl) || '',
      startTime: new Date().getTime(),
      endTime: null,
      completed: false
    };

    // Send immediate analytics update if analytics module enabled
    var has_analytics = document.getElementById('has_analytics');
    if (has_analytics && has_analytics.innerText == '1') {
      sendAnalytics();
    }
  };

  window.SMARTNS.onAdHide = function (adData) {
    if (DEBUG_ENABLED) debugLog('RTL: === AD HIDDEN ===', adData);
    debugLog('SmartClip ad hidden:', adData);

    // Restore DASH video to broadcast dimensions when ad hides
    var has_player = document.getElementById('has_player');
    if (has_player && has_player.innerText === '1') {
      debugLog('SmartClip ad ending - restoring DASH player to full size...');
      // Wait for broadcast element to restore
      setTimeout(function () {
        matchVideoToBroadcast();
      }, 150); // Match timing with broadcast restore
    }

    if (currentSmartclipAd) {
      currentSmartclipAd.endTime = new Date().getTime();
      currentSmartclipAd.actualDuration = currentSmartclipAd.endTime - currentSmartclipAd.startTime;

      // Add to historical data using cloneObject instead of spread operator
      smartclipAdData.push(cloneObject(currentSmartclipAd));

      // Update totals
      smartclipAdDuration += currentSmartclipAd.actualDuration;

      currentSmartclipAd = null;
    }

    // Send analytics update
    var has_analytics = document.getElementById('has_analytics');
    if (has_analytics && has_analytics.innerText == '1') {
      sendAnalytics();
    }
  };

  window.SMARTNS.onAdComplete = function (adData) {
    if (DEBUG_ENABLED) debugLog('RTL: === AD COMPLETED ===', adData);
    debugLog('SmartClip ad completed:', adData);
    smartclipAdsCompleted++;

    if (currentSmartclipAd) {
      currentSmartclipAd.completed = true;
    }

    // Send analytics update
    var has_analytics = document.getElementById('has_analytics');
    if (has_analytics && has_analytics.innerText == '1') {
      sendAnalytics();
    }
  };

  window.SMARTNS.onAdSkip = function (adData) {
    if (DEBUG_ENABLED) debugLog('RTL: === AD SKIPPED ===', adData);
    debugLog('SmartClip ad skipped:', adData);

    if (currentSmartclipAd) {
      currentSmartclipAd.skipped = true;
      currentSmartclipAd.endTime = new Date().getTime();
      currentSmartclipAd.actualDuration = currentSmartclipAd.endTime - currentSmartclipAd.startTime;

      // Add to historical data using cloneObject instead of spread operator
      smartclipAdData.push(cloneObject(currentSmartclipAd));
      smartclipAdDuration += currentSmartclipAd.actualDuration;

      currentSmartclipAd = null;
    }

    // Send analytics update
    var has_analytics = document.getElementById('has_analytics');
    if (has_analytics && has_analytics.innerText == '1') {
      sendAnalytics();
    }
  };

  window.SMARTNS.onAdClick = function (adData) {
    if (DEBUG_ENABLED) debugLog('RTL: === AD CLICKED ===', adData);
    debugLog('SmartClip ad clicked:', adData);

    if (currentSmartclipAd) {
      currentSmartclipAd.clicked = true;
    }

    // Send analytics update
    var has_analytics = document.getElementById('has_analytics');
    if (has_analytics && has_analytics.innerText == '1') {
      sendAnalytics();
    }
  };
}

function setVideo() {
  if (DEBUG_ENABLED) debugLog('=== PLAYER: Initializing DASH ===');

  var slug = document.getElementById('slug');
  var app_store_url_el = document.getElementById('app_store_url');
  if (DEBUG_ENABLED) debugLog('PLAYER: Slug = ' + slug.innerText);

  // Check if AWS SSAI is enabled - prefix params with 'ads.' if true
  var is_aws_ssai_el = document.getElementById('is_aws_ssai');
  var is_aws_ssai = is_aws_ssai_el && is_aws_ssai_el.innerText == '1';
  var p = is_aws_ssai ? 'ads.' : '';

  var app_bundle_el = document.getElementById('app_bundle');
  var app_bundle_val = app_bundle_el && app_bundle_el.innerText
    ? app_bundle_el.innerText.trim()
    : 'com.wedotv.' + slug.innerText + '.wedomovies';
  var app_bundle = p + 'app_bundle=' + encodeURIComponent(app_bundle_val) + '&';
  var app_name = p + 'app_name=wedotv&';
  var app_store_url = p + 'app_store_url=' + encodeURIComponent(app_store_url_el.innerText) + '&';
  var url = p + 'url=wedotv.com&';
  var genre = p + 'genre=&';
  var ic = p + 'ic=&';
  var pod_duration = p + 'pod_duration=120&';
  var us_privacy = p + 'us_privacy=&';
  var cb = p + 'cb=' + (Math.floor(Math.random() * 90000000) + 10000000) + '&';
  var min_ad_duration = p + 'min_ad_duration=6&';
  var max_ad_duration = p + 'max_ad_duration=60&';
  var app_category = p + 'app_category=movies&';
  var content_cat = p + 'content_cat=IAB1-5&';
  var content_genre = p + 'content_genre=movies&';
  var content_keywords = p + 'content_keywords=movies&';
  var device_type = p + 'device_type=CONNECTED_TV&';

  var has_consent = document.getElementById('has_consent');
  var has_didomi_consent = document.getElementById('has_didomi_consent');
  var gdpr = p + 'gdpr=1&';
  var channel_name = p + 'channel_name=' + slug.innerText + '&';

  // Determine which consent string to use (Didomi or Wedo CMP)
  var gdpr_consent_value = '';
  var gpp_string_value = '';
  if (has_didomi_consent && has_didomi_consent.innerText == '1') {
    // Use Didomi TCF consent string (IAB TCF v2)
    gdpr_consent_value = window.didomiConsentString || '';
    // Use Didomi GPP string (IAB Global Privacy Platform)
    gpp_string_value = window.didomiGppString || '';
  } else if (has_consent && has_consent.innerText == '1') {
    // Use Wedo CMP consent string
    gdpr_consent_value = consentString;
  }
  var gdpr_consent = p + 'gdpr_consent=' + encodeURIComponent(gdpr_consent_value) + '&';
  var gpp = gpp_string_value ? (p + 'gpp=' + encodeURIComponent(gpp_string_value) + '&') : '';
  var did = p + 'did=' + uniqid + '&';
  var dnt = p + 'dnt=&';
  var coppa = p + 'coppa=&';
  var iu = p + 'iu=&';
  var idtype = p + 'idtype=&';
  var consent2 = p + 'consent=' + encodeURIComponent(gdpr_consent_value) + '&';
  var ua = p + 'ua=' + encodeURIComponent(navigator.userAgent) + '&';
  var ip = p + 'ip=' + (ipAddr || '') + '&';
  var player_width = p + 'player_width=1920&';
  var player_height = p + 'player_height=1080&';
  var ifa_type = p + 'ifa_type=dpid&';

  // AWS SSAI additional params with GetPublica naming
  var aws_ssai_params = '';
  if (is_aws_ssai) {
    var content_channel = p + 'content_channel=' + slug.innerText + '&';
    var content_url = p + 'content_url=wedotv.com&';
    var content_language_el = document.getElementById('content_language');
    var device_language_el = document.getElementById('device_language');
    var content_language_val = content_language_el && content_language_el.innerText
      ? content_language_el.innerText.trim()
      : '';
    var device_language_val = device_language_el && device_language_el.innerText
      ? device_language_el.innerText.trim()
      : '';
    var content_language_param = content_language_val
      ? p + 'content_language=' + encodeURIComponent(content_language_val) + '&'
      : '';
    var device_language_param = device_language_val
      ? p + 'device_language=' + encodeURIComponent(device_language_val) + '&'
      : '';
    aws_ssai_params = content_channel + content_url + content_language_param + device_language_param;
  }

  // Function to initialize the DASH player (called after URL is ready)
  async function initializeDashPlayer(finalUrl) {
    dash_link_fast = finalUrl;

    if (DEBUG_ENABLED) debugLog('PLAYER: DASH URL = ' + dash_link_fast);
    logInitStep('buildDashUrl', 'success', 'DASH URL built: ' + dash_link_fast);

    var appManager = document.getElementById('applicationManager');
    if (!appManager) {
      if (DEBUG_ENABLED) debugLog('PLAYER: ERROR - appManager not found');
      logInitStep('validateAppManager', 'failure', 'appManager element not found');
      return;
    }
    if (DEBUG_ENABLED) debugLog('PLAYER: appManager found');
    logInitStep('validateAppManager', 'success', 'appManager element found');

    broadcastContainer = document.getElementById('broadcast-video');
    if (!broadcastContainer) {
      if (DEBUG_ENABLED) debugLog('PLAYER: ERROR - broadcast-video not found');
      logInitStep('validateBroadcastVideo', 'failure', 'broadcast-video element not found');
      return;
    }
    if (DEBUG_ENABLED) debugLog('PLAYER: broadcast-video found');
    logInitStep('validateBroadcastVideo', 'success', 'broadcast-video element found');

    var appObject = appManager.getOwnerApplication(document);
    if (appObject === null) {
      if (DEBUG_ENABLED) debugLog('PLAYER: ERROR - appObject is null');
      logInitStep('getOwnerApplication', 'failure', 'appObject is null');
      return;
    } else {
      if (DEBUG_ENABLED) debugLog('PLAYER: appObject obtained, showing app');
      logInitStep('getOwnerApplication', 'success', 'appObject obtained and shown');
      appObject.show();
      // broadcastContainer.bindToCurrentChannel();
      var ch = broadcastContainer.currentChannel;

      broadcastContainer.style.display = 'none';

      if (DEBUG_ENABLED) debugLog('PLAYER: Creating video element...');
      var video = document.createElement('video');
      video.setAttribute('id', 'video');
      video.setAttribute('controls', 'false');
      video.controls = false;
      video.setAttribute('autoplay', 'autoplay');

      video.style.position = 'absolute';
      video.style.left = 0;
      video.style.top = 0;
      video.style.width = '1280px';
      video.style.height = '720px';
      video.muted = true;

      // Set z-index to be above broadcast
      document.body.appendChild(video);
      logInitStep('createVideoElement', 'success', 'Video element created and appended');

      if (DEBUG_ENABLED) debugLog('PLAYER: Checking dashjs library...');
      // Check if dashjs is available (critical for old browsers)
      if (typeof dashjs === 'undefined') {
        if (DEBUG_ENABLED) debugLog('PLAYER: ERROR - dashjs not loaded!');
        debugLog('ERROR: dashjs library not loaded - cannot initialize video player');
        logInitStep('checkDashjsLibrary', 'failure', 'dashjs library not loaded');
        return;
      }
      if (DEBUG_ENABLED) debugLog('PLAYER: dashjs library OK');
      logInitStep('checkDashjsLibrary', 'success', 'dashjs library available');

      if (DEBUG_ENABLED) debugLog('PLAYER: Creating DASH player instance...');
      // load and play the DASH video
      dash = dashjs.MediaPlayer().create();
      dash.on(dashjs.MediaPlayer.events.MANIFEST_LOADED, function (e) {
        // console.log("### Manifest successfully loaded or refreshed!", e, dash.duration());
        // // dash.seek(dash.duration());
        // dash.play()
      });
      logInitStep('createDashPlayer', 'success', 'DASH MediaPlayer instance created');

      if (DEBUG_ENABLED) debugLog('PLAYER: Initializing player with URL...');
      dash.initialize(video, dash_link_fast, true);
      dash.setAutoPlay(true);
      logInitStep('initializePlayer', 'success', 'Player initialized with DASH URL');

      if (DEBUG_ENABLED) debugLog('PLAYER: Starting playback...');
      await dash.play();
      logInitStep('startPlayback', 'success', 'Playback started');

      if (DEBUG_ENABLED) debugLog('=== PLAYER: Initialization Complete ===');
      logInitStep('playerComplete', 'success', 'Player initialization fully completed');
      video.play()
    }
  }

  // Build URL and initialize player based on mode
  if (is_aws_ssai) {
    if (DEBUG_ENABLED) debugLog('PLAYER: AWS SSAI mode - initializing MediaTailor session');

    // AWS SSAI: Build ads params string (without leading ?) for session initialization
    var livestream = p + 'livestream=1&';

    // Get stagger count from DOM and build stagger parameter if enabled
    var stagger_count_el = document.getElementById('stagger_count');
    var stagger_count = stagger_count_el ? parseInt(stagger_count_el.innerText, 10) : 0;
    var stagger_param = '';
    if (stagger_count > 0 && uniqid) {
      var staggerIndex = getStaggerIndex(uniqid, stagger_count);
      stagger_param = p + 'stagger=s' + staggerIndex + '&';
      if (DEBUG_ENABLED) debugLog('PLAYER: Stagger enabled - assigned to s' + staggerIndex + ' of ' + stagger_count);
    }

    var adsParams = app_bundle + app_name + app_store_url + url + pod_duration + cb + channel_name +
      gdpr + gdpr_consent + consent2 + max_ad_duration + app_category + content_cat + content_genre + content_keywords + device_type + gpp + did + dnt + coppa + min_ad_duration +
      player_width + player_height + livestream + ifa_type + stagger_param + aws_ssai_params;

    // Remove trailing '&' if present
    if (adsParams.charAt(adsParams.length - 1) === '&') {
      adsParams = adsParams.substring(0, adsParams.length - 1);
    }

    // Initialize MediaTailor session, then start player with returned manifest URL
    initMediaTailorSession(dash_link, adsParams, function (manifestUrl) {
      initializeDashPlayer(manifestUrl);
    });
  } else {
    if (DEBUG_ENABLED) debugLog('PLAYER: Non-SSAI mode - including all parameters');

    // Non-SSAI: Build URL directly and initialize player
    var directUrl = dash_link + '?' + app_bundle + app_name + app_store_url + url + pod_duration + genre +
      channel_name + ic + us_privacy + gdpr + gdpr_consent + consent2 + max_ad_duration + app_category + content_cat + content_genre + content_keywords + device_type + gpp + did + dnt +
      coppa + iu + idtype + cb + min_ad_duration + ua + ip + player_width + player_height;
    initializeDashPlayer(directUrl);
  }
}

/**
 * Initialize HLS.js video player
 * Handles HLS streaming with fallback for devices without MSE support
 */
function setHlsVideo() {
  if (DEBUG_ENABLED) debugLog('=== PLAYER: Initializing HLS ===');

  var slug = document.getElementById('slug');
  var app_store_url_el = document.getElementById('app_store_url');
  if (DEBUG_ENABLED) debugLog('PLAYER: Slug = ' + slug.innerText);

  // Check if AWS SSAI is enabled - prefix params with 'ads.' if true
  var is_aws_ssai_el = document.getElementById('is_aws_ssai');
  var is_aws_ssai = is_aws_ssai_el && is_aws_ssai_el.innerText == '1';
  var p = is_aws_ssai ? 'ads.' : '';

  var app_bundle_el = document.getElementById('app_bundle');
  var app_bundle_val = app_bundle_el && app_bundle_el.innerText
    ? app_bundle_el.innerText.trim()
    : 'com.wedotv.' + slug.innerText + '.wedomovies';
  var app_bundle = p + 'app_bundle=' + encodeURIComponent(app_bundle_val) + '&';
  var app_name = p + 'app_name=wedotv&';
  var app_store_url = p + 'app_store_url=' + encodeURIComponent(app_store_url_el.innerText) + '&';
  var url = p + 'url=wedotv.com&';
  var genre = p + 'genre=&';
  var ic = p + 'ic=&';
  var us_privacy = p + 'us_privacy=&';
  var cb = p + 'cb=' + (Math.floor(Math.random() * 90000000) + 10000000) + '&';
  var min_ad_duration = p + 'min_ad_duration=6&';
  var pod_duration = p + 'pod_duration=60&';
  var ifa_type = p + 'ifa_type=dpid&';
  var content_cat = p + 'content_cat=IAB1-5&';
  var content_genre = p + 'content_genre=movies&';

  var has_consent = document.getElementById('has_consent');
  var has_didomi_consent = document.getElementById('has_didomi_consent');
  var gdpr = p + 'gdpr=1&';
  var channel_name = p + 'channel_name=' + slug.innerText + '&';

  // Determine which consent string to use (Didomi or Wedo CMP)
  var gdpr_consent_value = '';
  var gpp_string_value = '';
  if (has_didomi_consent && has_didomi_consent.innerText == '1') {
    gdpr_consent_value = window.didomiConsentString || '';
    gpp_string_value = window.didomiGppString || '';
  } else if (has_consent && has_consent.innerText == '1') {
    gdpr_consent_value = consentString;
  }
  var gdpr_consent = p + 'gdpr_consent=' + encodeURIComponent(gdpr_consent_value) + '&';
  var gpp = gpp_string_value ? (p + 'gpp=' + encodeURIComponent(gpp_string_value) + '&') : '';
  var did = p + 'did=' + uniqid + '&';
  var dnt = p + 'dnt=0&';
  var coppa = p + 'coppa=0&';
  var iu = p + 'iu=&';
  var idtype = p + 'idtype=&';
  var consent2 = p + 'consent=' + encodeURIComponent(gdpr_consent_value) + '&';
  var ua = p + 'ua=' + encodeURIComponent(navigator.userAgent) + '&';
  var ip = p + 'ip=' + (ipAddr || '') + '&';
  var player_width = p + 'player_width=1920&';
  var player_height = p + 'player_height=1080&';

  // AWS SSAI additional params with GetPublica naming
  var aws_ssai_params = '';
  if (is_aws_ssai) {
    var content_channel = p + 'content_channel=' + slug.innerText + '&';
    var content_url = p + 'content_url=wedotv.com&';
    var content_language_el = document.getElementById('content_language');
    var device_language_el = document.getElementById('device_language');
    var content_language_val = content_language_el && content_language_el.innerText
      ? content_language_el.innerText.trim()
      : '';
    var device_language_val = device_language_el && device_language_el.innerText
      ? device_language_el.innerText.trim()
      : '';
    var content_language_param = content_language_val
      ? p + 'content_language=' + encodeURIComponent(content_language_val) + '&'
      : '';
    var device_language_param = device_language_val
      ? p + 'device_language=' + encodeURIComponent(device_language_val) + '&'
      : '';
    aws_ssai_params = content_channel + content_url + content_language_param + device_language_param;
  }

  // Function to initialize the HLS player (called after URL is ready)
  function initializeHlsPlayer(finalUrl) {
    var hls_link_fast = finalUrl;

    if (DEBUG_ENABLED) debugLog('PLAYER: HLS URL = ' + hls_link_fast);
    logInitStep('buildHlsUrl', 'success', 'HLS URL built: ' + hls_link_fast);

    var appManager = document.getElementById('applicationManager');
    if (!appManager) {
      if (DEBUG_ENABLED) debugLog('PLAYER: ERROR - appManager not found');
      logInitStep('validateAppManager', 'failure', 'appManager element not found');
      return;
    }
    if (DEBUG_ENABLED) debugLog('PLAYER: appManager found');
    logInitStep('validateAppManager', 'success', 'appManager element found');

    broadcastContainer = document.getElementById('broadcast-video');
    if (!broadcastContainer) {
      if (DEBUG_ENABLED) debugLog('PLAYER: ERROR - broadcast-video not found');
      logInitStep('validateBroadcastVideo', 'failure', 'broadcast-video element not found');
      return;
    }
    if (DEBUG_ENABLED) debugLog('PLAYER: broadcast-video found');
    logInitStep('validateBroadcastVideo', 'success', 'broadcast-video element found');

    var appObject = appManager.getOwnerApplication(document);
    if (appObject === null) {
      if (DEBUG_ENABLED) debugLog('PLAYER: ERROR - appObject is null');
      logInitStep('getOwnerApplication', 'failure', 'appObject is null');
      return;
    }

    if (DEBUG_ENABLED) debugLog('PLAYER: appObject obtained, showing app');
    logInitStep('getOwnerApplication', 'success', 'appObject obtained and shown');
    appObject.show();

    broadcastContainer.style.display = 'none';

    if (DEBUG_ENABLED) debugLog('PLAYER: Creating video element...');
    var video = document.createElement('video');
    video.setAttribute('id', 'video');
    video.setAttribute('controls', 'false');
    video.controls = false;
    video.setAttribute('autoplay', 'autoplay');

    video.style.position = 'absolute';
    video.style.left = 0;
    video.style.top = 0;
    video.style.width = '1280px';
    video.style.height = '720px';

    document.body.appendChild(video);
    logInitStep('createVideoElement', 'success', 'Video element created and appended');

    // Check for HLS.js library
    if (typeof Hls === 'undefined') {
      if (DEBUG_ENABLED) debugLog('PLAYER: ERROR - HLS.js not loaded!');
      logInitStep('checkHlsLibrary', 'failure', 'HLS.js library not loaded');

      // Fallback: Try native HLS support (Safari, some HbbTV devices)
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        if (DEBUG_ENABLED) debugLog('PLAYER: Using native HLS support');
        logInitStep('nativeHlsSupport', 'success', 'Using native HLS playback');
        video.src = hls_link_fast;
        video.play();
        return;
      }

      debugLog('ERROR: No HLS support available - cannot initialize video player');
      logInitStep('hlsNotSupported', 'failure', 'No HLS support available');
      return;
    }

    // Check if HLS.js is supported (requires MSE)
    if (!Hls.isSupported()) {
      if (DEBUG_ENABLED) debugLog('PLAYER: HLS.js not supported, checking native support');
      logInitStep('checkHlsSupport', 'failure', 'HLS.js MSE not supported');

      // Fallback to native HLS if available
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        if (DEBUG_ENABLED) debugLog('PLAYER: Using native HLS support');
        logInitStep('nativeHlsSupport', 'success', 'Using native HLS playback');
        video.src = hls_link_fast;
        video.play();
        return;
      }

      debugLog('ERROR: HLS not supported on this device');
      logInitStep('hlsNotSupported', 'failure', 'No HLS support available');
      return;
    }

    if (DEBUG_ENABLED) debugLog('PLAYER: HLS.js library OK, creating instance...');
    logInitStep('checkHlsLibrary', 'success', 'HLS.js library available');

    // Create HLS.js instance with HbbTV-optimized config
    hls = new Hls({
      debug: DEBUG_ENABLED,
      enableWorker: false,  // Disable web workers for HbbTV compatibility
      lowLatencyMode: false,
      backBufferLength: 30,
      maxBufferLength: 30,
      maxMaxBufferLength: 60
    });

    logInitStep('createHlsPlayer', 'success', 'HLS instance created');

    // Attach and load
    hls.attachMedia(video);
    hls.on(Hls.Events.MEDIA_ATTACHED, function () {
      if (DEBUG_ENABLED) debugLog('PLAYER: HLS media attached, loading source...');
      hls.loadSource(hls_link_fast);
    });

    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      if (DEBUG_ENABLED) debugLog('PLAYER: HLS manifest parsed, starting playback...');
      logInitStep('manifestParsed', 'success', 'HLS manifest parsed');
      video.play();
      logInitStep('startPlayback', 'success', 'HLS playback started');
    });

    // Error handling with recovery
    hls.on(Hls.Events.ERROR, function (event, data) {
      if (data.fatal) {
        debugLog('PLAYER: Fatal HLS error: ' + data.type + ' - ' + data.details);
        logInitStep('hlsError', 'failure', 'Fatal HLS error: ' + data.details);

        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            debugLog('PLAYER: Network error, attempting recovery...');
            hls.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            debugLog('PLAYER: Media error, attempting recovery...');
            hls.recoverMediaError();
            break;
          default:
            debugLog('PLAYER: Unrecoverable HLS error');
            hls.destroy();
            break;
        }
      }
    });

    if (DEBUG_ENABLED) debugLog('=== PLAYER: HLS Initialization Complete ===');
    logInitStep('playerComplete', 'success', 'HLS player initialization fully completed');
  }

  // Build URL and initialize player based on mode
  if (is_aws_ssai) {
    if (DEBUG_ENABLED) debugLog('PLAYER: AWS SSAI mode - initializing MediaTailor session');

    // AWS SSAI: Build ads params string (without leading ?) for session initialization
    var livestream = p + 'livestream=1&';

    // Get stagger count from DOM and build stagger parameter if enabled
    var stagger_count_el = document.getElementById('stagger_count');
    var stagger_count = stagger_count_el ? parseInt(stagger_count_el.innerText, 10) : 0;
    var stagger_param = '';
    if (stagger_count > 0 && uniqid) {
      var staggerIndex = getStaggerIndex(uniqid, stagger_count);
      stagger_param = p + 'stagger=s' + staggerIndex + '&';
      if (DEBUG_ENABLED) debugLog('PLAYER: Stagger enabled - assigned to s' + staggerIndex + ' of ' + stagger_count);
    }

    var adsParams = app_bundle + app_name + app_store_url + url + pod_duration + cb + channel_name +
      gdpr + gdpr_consent + consent2 + gpp + did + dnt + coppa + min_ad_duration +
      player_width + player_height + livestream + ifa_type + content_cat + content_genre + stagger_param + aws_ssai_params;

    // Remove trailing '&' if present
    if (adsParams.charAt(adsParams.length - 1) === '&') {
      adsParams = adsParams.substring(0, adsParams.length - 1);
    }

    // Initialize MediaTailor session, then start player with returned manifest URL
    initMediaTailorSession(dash_link, adsParams, function (manifestUrl) {
      initializeHlsPlayer(manifestUrl);
    });
  } else {
    if (DEBUG_ENABLED) debugLog('PLAYER: Non-SSAI mode - including all parameters');

    // Non-SSAI: Build URL directly and initialize player
    var directUrl = dash_link + '?' + app_bundle + app_name + app_store_url + url + genre +
      channel_name + ic + us_privacy + gdpr + gdpr_consent + consent2 + gpp + did + dnt +
      coppa + iu + idtype + cb + min_ad_duration + ua + ip + player_width + player_height;
    initializeHlsPlayer(directUrl);
  }
}

function setUniqId() {
  // Try to get from localStorage first (more reliable than cookies) with feature detection
  try {
    if (typeof localStorage !== 'undefined' && localStorage.getItem) {
      uniqid = localStorage.getItem('hbbtv_uniqid');
    }
  } catch (e) {
    // localStorage not available, continue with cookie fallback
  }

  if (!uniqid) {
    // Try cookies as fallback
    var match = document.cookie.match(new RegExp('(^| )uniqid=([^;]+)'));
    if (match) {
      uniqid = match[2];
      // Save to localStorage for future use if available
      try {
        if (typeof localStorage !== 'undefined' && localStorage.setItem) {
          localStorage.setItem('hbbtv_uniqid', uniqid);
        }
      } catch (e) {
        // localStorage not available, ignore
      }
    }
  }

  if (!uniqid) {
    // Generate new uniqid with timestamp for true uniqueness
    var timestamp = new Date().getTime().toString(36);
    var random = Math.random().toString(36).substring(2, 8);
    uniqid = (timestamp + random)
      .match(/.{1,4}/g)
      .join('-');

    // Save to both localStorage and cookie
    try {
      if (typeof localStorage !== 'undefined' && localStorage.setItem) {
        localStorage.setItem('hbbtv_uniqid', uniqid);
      }
    } catch (e) {
      // localStorage not available, ignore
    }

    // Also try to save as cookie
    document.cookie = 'uniqid=' + uniqid + '; path=/; max-age=31536000'; // 1 year
  }
}

function setConsentImage(qr) {
  var vc = document.getElementById('parentContainer');
  if (!vc) {
    return;
  }

  vc.style.zIndex = 900;
  // get first video child of vc
  var vid = vc.children[0];
  if (!vid) {
    return;
  }

  var img;
  var tagW, tagWidth, qrW, qrWidth, qrH, qrHeight;

  var imgTag = document.createElement('img');
  if (vid.offsetWidth == 1920) {
    img = '/hbbtv/images/' + document.getElementById('lang').innerText + '_' + vc.offsetWidth + '.png';
    tagW = '121px';
    tagWidth = (1782 - 103) + 'px';
    qrW = '121px';
    qrWidth = (301 - 121) + 'px';
    qrH = '840px';
    qrHeight = (1020 - 840) + 'px';
    imgTag.style.width = '1920px';
  } else {
    img = '/hbbtv/images/' + document.getElementById('lang').innerText + '_1280.png';
    tagW = (121 * 0.66) + 'px';
    tagWidth = ((1782 - 103) * 0.66) + 'px';
    qrW = (121 * 0.66) + 'px';
    qrWidth = ((301 - 121) * 0.66) + 'px';
    qrH = (840 * 0.66) + 'px';
    qrHeight = ((1020 - 840) * 0.66) + 'px';
    imgTag.style.width = '1280px';
  }
  imgTag.src = img;
  imgTag.style.position = 'absolute';
  imgTag.style.zIndex = 999; // Ensure this is higher than vidcontainer
  imgTag.style.top = 0;
  imgTag.style.left = 0;

  imgTag.style.display = 'block';
  imgTag.style.backgroundSize = 'cover';
  imgTag.style.backgroundPosition = 'center';
  imgTag.style.backgroundRepeat = 'no-repeat';
  vc.appendChild(imgTag);

  var imgQr = document.createElement('img');
  imgQr.src = qr;
  imgQr.style.position = 'absolute';
  imgQr.style.width = qrWidth;
  imgQr.style.height = qrHeight;
  imgQr.style.zIndex = 1000;
  imgQr.style.top = qrH;
  imgQr.style.left = qrW;
  imgQr.style.display = 'block';
  imgQr.style.backgroundSize = 'cover';
  imgQr.style.backgroundPosition = 'center';
  imgQr.style.backgroundRepeat = 'no-repeat';

  vc.appendChild(imgQr);

  // in 20 seconds hide image
  setTimeout(function () {
    imgTag.style.display = 'none';
    imgQr.style.display = 'none';
  }, 20000);
}

function getNewConsent(url) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var res = JSON.parse(xhr.responseText);
        consentString = res.consent.tcf_string;
        expire_tcf_string = res.consent.expire.timestamp;
        // Stamp the opt-in moment only on first acceptance. Refreshing it
        // on every successful response would reset Smartclip's 24h window.
        var existing = (function () {
          try { var ls = window.localStorage && window.localStorage.getItem('consent_time_given'); if (ls) return ls; } catch (e) { }
          var m = document.cookie.match(/(?:^|; )consent_time_given=([^;]+)/);
          return m ? m[1] : null;
        })();
        if (!existing) {
          var consentTimeGiven = String(new Date().getTime());
          document.cookie = 'consent_time_given=' + consentTimeGiven + '; path=/; max-age=31536000';
          try { window.localStorage && window.localStorage.setItem('consent_time_given', consentTimeGiven); } catch (e) { }
        }
        document.cookie = 'tcf_string=' + consentString + '; path=/';
        document.cookie = 'expire_tcf_string=' + expire_tcf_string + '; path=/';
        return res;
      }
    }
  };
}

function setToTrue() {
  var url = "https://api-applicaster.wedo.tv/cmp?device_id=" + uniqid
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var res = JSON.parse(xhr.responseText);
        // debugLog(res);
        var qr = res.buttons.customize.options[0].qr;
        // debugLog(qr);
        getNewConsent(res.buttons.yes.callback_url);
        setConsentImage(qr);
        return res;
      }
    }
  };
}

function getQRData(starting) {
  // Handle default parameter for old browser compatibility
  if (typeof starting === 'undefined') {
    starting = true;
  }

  var match = document.cookie.match(new RegExp('(^| )expire_tcf_string=([^;]+)'));
  if (match) {
    var expire_tcf_string = match[2];
    var currentTime = Math.floor(new Date().getTime() / 1000);
    var ratio = currentTime / expire_tcf_string;
    if (ratio.toString().match(/^0\./)) {
      // debugLog('consent is still valid');
      var consentMatch = document.cookie.match(new RegExp('(^| )tcf_string=([^;]+)'));
      if (consentMatch && consentMatch.length > 2) {
        consentString = consentMatch[2];
      }
    } else {
      // debugLog('consent has expired');
      if (starting) {
        setToTrue();
      }
    }
  } else {
    // debugLog('no consent cookie found');
    if (starting) {
      setToTrue();
    }
  }
}


function setConsent() {
  getQRData();
  setTimeout(function () {
    getQRData(false);
  }, 20000);
}

function initHbbTVApp() {
  var appManager = document.getElementById('applicationManager');
  if (appManager && appManager.getOwnerApplication) {
    hbbtvApp = appManager.getOwnerApplication(document);
    if (hbbtvApp) {
      hbbtvApp.show();
      return true;
    }
  }
  return false;
}

function initApp() {
  logInitStep('initApp', 'started', 'HbbTV application initialization started');

  setUniqId();
  logInitStep('setUniqId', 'success', 'Unique ID set: ' + (uniqid || 'not available'));

  // Enable debug and console overlay for 'genius' slug (MUST BE FIRST)
  var slugElement = document.getElementById('slug');
  if (slugElement && slugElement.innerText === 'genius') {
    DEBUG_ENABLED = true;
    DEBUG_CONSOLE_OVERLAY = true;
    debugLog('=== DEBUG MODE ENABLED FOR GENIUS SLUG ===');
    logInitStep('debugMode', 'success', 'Debug mode enabled for genius slug');
  }

  // Initialize console overlay (must be called early, after debug flags set)
  initConsoleOverlay();
  logInitStep('initConsoleOverlay', 'success', 'Console overlay initialized');

  // Initialize HbbTV application
  var hbbtvSuccess = initHbbTVApp();
  if (hbbtvSuccess) {
    logInitStep('initHbbTVApp', 'success', 'HbbTV application initialized');
  } else {
    logInitStep('initHbbTVApp', 'failure', 'HbbTV application failed to initialize');
  }

  // TODO, we need to time this correctly!
  var has_consent = document.getElementById('has_consent');
  if (has_consent && has_consent.innerText == '1') {
    logInitStep('setConsent', 'started', 'Consent initialization started');
    setConsent();
  } else {
    logInitStep('setConsent', 'success', 'Consent disabled - skipped');
  }

  var has_analytics = document.getElementById('has_analytics');
  if (has_analytics && has_analytics.innerText == '1') {
    //   logInitStep('getIpData', 'started', 'Analytics initialization started');
    getIpData();
  } else {
    //   logInitStep('getIpData', 'success', 'Analytics disabled - skipped');
  }

  // Initialize RTL (SmartClip) FIRST if enabled
  // This must run before setVideo() to avoid conflicts in old browsers
  var has_rtl = document.getElementById('has_rtl');
  var has_player = document.getElementById('has_player');
  var rtlEnabled = has_rtl && has_rtl.innerText == '1';
  var playerEnabled = has_player && has_player.innerText == '1';

  // if (rtlEnabled) {
  //   logInitStep('setRtl', 'started', 'RTL/SmartClip initialization started');
  //   setRtl();
  //   logInitStep('setRtl', 'success', 'RTL/SmartClip initialized');
  // } else {
  //   logInitStep('setRtl', 'success', 'RTL disabled - skipped');
  // }

  // Initialize video player AFTER RTL
  if (playerEnabled) {
    // Check if Didomi consent is enabled
    var has_didomi_consent = document.getElementById('has_didomi_consent');
    var didomiEnabled = has_didomi_consent && has_didomi_consent.innerText == '1';

    // Determine player type (HLS or DASH)
    var player_type_el = document.getElementById('player_type');
    playerType = player_type_el ? player_type_el.innerText : 'dash';
    var initPlayer = playerType === 'hls' ? setHlsVideo : setVideo;
    var playerTypeName = playerType.toUpperCase();

    if (DEBUG_ENABLED) debugLog('INIT: Player type selected: ' + playerTypeName);

    // Function to start video player (with RTL delay if needed)
    var startVideoPlayer = function () {
      // If BOTH RTL and player are enabled, wait 4 seconds for SmartClip to fully initialize
      if (rtlEnabled) {
        if (DEBUG_ENABLED) debugLog('INIT: Both RTL and Player enabled - waiting 4 seconds before initializing ' + playerTypeName + ' player...');
        logInitStep('setVideo', 'started', 'Player init delayed 4 seconds (waiting for RTL)');
        setTimeout(function () {
          if (DEBUG_ENABLED) debugLog('INIT: 4-second delay complete, initializing ' + playerTypeName + ' player now...');
          logInitStep('setVideo', 'started', playerTypeName + ' player initialization started (after 4s delay)');
          initPlayer();
        }, 4000);
      } else {
        // RTL disabled, initialize player immediately
        if (DEBUG_ENABLED) debugLog('INIT: RTL disabled, initializing ' + playerTypeName + ' player immediately...');
        logInitStep('setVideo', 'started', playerTypeName + ' player initialization started (immediate)');
        initPlayer();
      }
    };

    // If Didomi is enabled, wait for consent popup to close before starting player
    if (didomiEnabled) {
      if (DEBUG_ENABLED) debugLog('INIT: Didomi consent enabled - waiting for user consent before starting player...');
      logInitStep('setVideo', 'started', 'Waiting for Didomi consent popup to close');

      // Register navigation keyset for Didomi consent UI (arrows + OK/ENTER)
      // This allows users to navigate the consent popup with their TV remote
      if (hbbtvApp && typeof rcUtils !== 'undefined') {
        rcUtils.setKeyset(hbbtvApp, rcUtils.MASK_CONSTANT_NAVIGATION + rcUtils.MASK_CONSTANT_RED);
        rcUtils.registerKeyEventListener()
        if (DEBUG_ENABLED) debugLog('INIT: Registered navigation keyset for Didomi consent popup');
        logInitStep('setKeyset', 'success', 'Navigation keyset registered for Didomi consent');
      }

      // Guard to prevent double player initialization
      var playerStarted = false;
      var safeStartPlayer = function () {
        if (playerStarted) {
          if (DEBUG_ENABLED) debugLog('INIT: Player already started, skipping duplicate call');
          return;
        }
        playerStarted = true;
        startVideoPlayer();
      };

      // Register callback for when consent popup closes (must be done first)
      // This callback will be called from hbbtv.blade.php when notice.hidden fires
      // or immediately if user already has stored consent
      window.onDidomiConsentReady = function () {
        if (DEBUG_ENABLED) debugLog('INIT: Didomi consent received via callback, starting player...');
        logInitStep('setVideo', 'started', 'Didomi consent popup closed - starting player');
        safeStartPlayer();
      };

      // Check if consent is already ready (returning user who already gave consent)
      // window.didomiConsentReady is set by didomiOnReady callback in hbbtv.blade.php
      // This handles the case where didomiOnReady already fired before initApp ran
      if (window.didomiConsentReady === true) {
        if (DEBUG_ENABLED) debugLog('INIT: Didomi consent already ready, starting player immediately...');
        logInitStep('setVideo', 'started', 'Didomi consent already ready');
        safeStartPlayer();
      } else {
        if (DEBUG_ENABLED) debugLog('INIT: Waiting for Didomi notice.hidden event...');
      }
    } else {
      // No Didomi consent, start player normally
      startVideoPlayer();
    }
  } else {
    logInitStep('setVideo', 'success', 'Player disabled - skipped');
  }

  logInitStep('initApp', 'success', 'HbbTV application initialization completed');
}
