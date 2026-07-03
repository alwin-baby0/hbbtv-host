import { Router } from '@lightningjs/sdk';
import { ROUTES } from '../../constants/globalConstants';

export const INACTIVITY_TIMEOUT = 300000; // 5 minutes

const INTERACTION_EVENTS = ['keydown', 'mousedown', 'pointerdown', 'touchstart'];

class InactivityService {
  constructor() {
    this.timeout = INACTIVITY_TIMEOUT;
    this.timerId = null;
    this.started = false;
    this.paused = false;
    this.screensaverActive = false;
    this.previousRoute = null;
    this.boundHandleInteraction = this.handleInteraction.bind(this);
  }

  start() {
    if (this.started) {
      this.reset();
      return;
    }

    this.started = true;
    this.paused = false;
    this.addInteractionListeners();
    this.reset();
  }

  stop() {
    this.started = false;
    this.paused = false;
    this.clearTimer();
    this.removeInteractionListeners();
  }

  pause() {
    this.paused = true;
    this.clearTimer();
  }

  resume() {
    if (!this.started) {
      this.start();
      return;
    }

    this.paused = false;
    this.reset();
  }

  reset() {
    if (!this.started || this.paused || this.screensaverActive) {
      return;
    }

    this.clearTimer();

    if (this.canActivateOnCurrentRoute()) {
      this.timerId = setTimeout(() => this.activateScreensaver(), this.timeout);
    }
  }

  activateScreensaver() {
    if (
      !this.started ||
      this.paused ||
      this.screensaverActive ||
      !this.canActivateOnCurrentRoute() ||
      Router.isNavigating()
    ) {
      this.reset();
      return;
    }

    const activeHash = Router.getActiveHash();

    if (!activeHash) {
      this.reset();
      return;
    }

    // Keep an explicit restore target before routing to the standalone screensaver page.
    this.previousRoute = {
      hash: activeHash,
      state: Router.getHistoryState(activeHash),
    };
    this.screensaverActive = true;
    this.clearTimer();
    setTimeout(() => {
      Router.navigate(ROUTES.SCREENSAVER, {});
    });
  }

  deactivateScreensaver() {
    if (!this.screensaverActive) {
      this.reset();
      return false;
    }

    const previousRoute = this.previousRoute;
    this.screensaverActive = false;
    this.previousRoute = null;

    if (!Router.isNavigating()) {
      if (previousRoute?.hash) {
        Router.navigate(previousRoute.hash, previousRoute.state || undefined, false);
      } else {
        Router.navigate(ROUTES.HOME, undefined, false);
      }
    }

    setTimeout(() => {
      Router.focusPage();
      this.reset();
    }, 0);

    return true;
  }

  handleInteraction(event) {
    if (this.screensaverActive || this.isScreensaverRoute()) {
      // The wake-up key should only close the screensaver, not trigger the restored page.
      event?.preventDefault?.();
      event?.stopImmediatePropagation?.();
      event?.stopPropagation?.();
      this.deactivateScreensaver();
      return;
    }

    this.reset();
  }

  notifyRouteChanged() {
    if (this.isExcludedRoute() || this.isScreensaverRoute()) {
      this.pause();
      return;
    }

    if (this.started && !this.screensaverActive) {
      this.paused = false;
      this.reset();
    }
  }

  canActivateOnCurrentRoute() {
    return !this.isScreensaverRoute() && !this.isExcludedRoute();
  }

  isScreensaverRoute() {
    return (
      Router.getActiveRoute() === ROUTES.SCREENSAVER ||
      Router.getActiveHash() === ROUTES.SCREENSAVER
    );
  }

  isExcludedRoute() {
    const activeRoute = Router.getActiveRoute();
    const activeHash = Router.getActiveHash();
    return (
      activeRoute === ROUTES.PLAYER ||
      activeHash === ROUTES.PLAYER ||
      activeRoute === ROUTES.SPLASH ||
      activeHash === ROUTES.SPLASH
    );
  }

  addInteractionListeners() {
    INTERACTION_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, this.boundHandleInteraction, true);
    });
  }

  removeInteractionListeners() {
    INTERACTION_EVENTS.forEach((eventName) => {
      window.removeEventListener(eventName, this.boundHandleInteraction, true);
    });
  }

  clearTimer() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  async getSessionUrl(url) {
    var returnUrl = url;
    var baseUrl = '';

    var urlMatch = url.match(/^(https?:\/\/[^\/]+)/);
    if (urlMatch) {
      baseUrl = urlMatch[1];
    }
    var sessionUrl = url.replace(/\/v1\/(?:dash|hls|master)\//, '/v1/session/');

    const body = {
      adsParams: {
        app_bundle: "com.wedotv.ses-astra.wedomovies",
        app_name: "wedotv",
        app_store_url: "",
        url: "wedotv.com",
        pod_duration: "120",
        cb: "59685711",
        channel_name: "ses-astra",
        gdpr: "1",
        gdpr_consent: "CQmuKQAQmuKQAAHABBENClFkAP_gAEPgAAQ4MHNR_G__bWlr-bb3abtkeYxP9_hr7sQxBgbIkm4FzLvW7JwGx2EZNAyatiIKmRIAu3TBIQNlHJDURUCgKIgFryDMaE2U4TNKJ6BkiFMZI2tQCFhvm4tjWQCYYur_9kc0mB-t7dr-2dzyy6hHn3a5fmS1UJCdIYesDfv8ZBOS-9IEd-x8v4v4_EbpEm8eSVn_pGtp4jc6YnM6dBmxt-Tyff6Pn_f71fe7X_ve_n3zv8oXH7rr6-__f_-7___-b_-___b-8GDQATDQ6IIyyIFAgUBCCBAAoKwgAoEAQAAJAUQEAJgwIcgYALrCJACAFAAMEAIAAQYAAgAAEgAQiACAAgEAIEAgUAAYAEAQEABAwABgAoRAIAAQHQMUgIIBAsAEiMKAwQIQAEggJbKhBKBgQVwhSLHAIIERMFAAAiAAUAACAeFgISSglYkEAXEF0ACAAAAFECLAikLMAUVBkC0FYEnAZGmAJPmCRJDoIgCYISEgyITUBIPFMUQIIcgNilmAOniCgBl2skAA.IMHNR_G__bXlv-bb36btkeYxf9_hr7sQxBgbIsm4FzLvW7JwG32EbNEyatiYKmRIAu3TBIQNtHJjURUChKIgVrzDsaE2U4TtKJ-BkiHMZY2tQCFhvm4tjWQCZYur_90d0mR-t7dr-2dzy27hnv3a9fuS1UJidKYetHfv8ZBOS-_IU9_x-_4v4_MbpEm8eSVv_tWtt43c64vP6dpuxt-Tyff6f__f73fe7X__e__33_-qXX_r76-__________f_______8AA.f_wACHwAAAAA",
        consent: "CQmuKQAQmuKQAAHABBENClFkAP_gAEPgAAQ4MHNR_G__bWlr-bb3abtkeYxP9_hr7sQxBgbIkm4FzLvW7JwGx2EZNAyatiIKmRIAu3TBIQNlHJDURUCgKIgFryDMaE2U4TNKJ6BkiFMZI2tQCFhvm4tjWQCYYur_9kc0mB-t7dr-2dzyy6hHn3a5fmS1UJCdIYesDfv8ZBOS-9IEd-x8v4v4_EbpEm8eSVn_pGtp4jc6YnM6dBmxt-Tyff6Pn_f71fe7X_ve_n3zv8oXH7rr6-__f_-7___-b_-___b-8GDQATDQ6IIyyIFAgUBCCBAAoKwgAoEAQAAJAUQEAJgwIcgYALrCJACAFAAMEAIAAQYAAgAAEgAQiACAAgEAIEAgUAAYAEAQEABAwABgAoRAIAAQHQMUgIIBAsAEiMKAwQIQAEggJbKhBKBgQVwhSLHAIIERMFAAAiAAUAACAeFgISSglYkEAXEF0ACAAAAFECLAikLMAUVBkC0FYEnAZGmAJPmCRJDoIgCYISEgyITUBIPFMUQIIcgNilmAOniCgBl2skAA.IMHNR_G__bXlv-bb36btkeYxf9_hr7sQxBgbIsm4FzLvW7JwG32EbNEyatiYKmRIAu3TBIQNtHJjURUChKIgVrzDsaE2U4TtKJ-BkiHMZY2tQCFhvm4tjWQCZYur_90d0mR-t7dr-2dzy27hnv3a9fuS1UJidKYetHfv8ZBOS-_IU9_x-_4v4_MbpEm8eSVv_tWtt43c64vP6dpuxt-Tyff6f__f73fe7X__e__33_-qXX_r76-__________f_______8AA.f_wACHwAAAAA",
        max_ad_duration: "60",
        app_category: "movies",
        content_cat: "IAB1-5",
        content_genre: "movies",
        content_keywords: "movies",
        device_type: "CONNECTED_TV",
        did: "mr3k-jdh7-nc4x-sq",
        dnt: "",
        coppa: "",
        min_ad_duration: "6",
        player_width: "1920",
        player_height: "1080",
        livestream: "1",
        ifa_type: "dpid",
        content_channel: "ses-astra",
        content_url: "wedotv.com",
        content_language: "DE",
        device_language: "DE",
        format: "hls"
      },
      reportingMode: "server"
    }

    const res = await fetch(sessionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return returnUrl;
    }

    const data = await res.json();
    const mediaTailorSessionUrl = data?.manifestUrl;
    if (mediaTailorSessionUrl) {
      // If manifest URL is relative (starts with /), prepend the base URL
      let fullManifestUrl = mediaTailorSessionUrl;
      if (mediaTailorSessionUrl && mediaTailorSessionUrl.charAt(0) === '/' && baseUrl) {
        fullManifestUrl = baseUrl + mediaTailorSessionUrl;
      }
      returnUrl = fullManifestUrl ?? url
    }

    return returnUrl
  }
}

export default new InactivityService();
