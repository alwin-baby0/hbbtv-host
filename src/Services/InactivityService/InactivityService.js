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
}

export default new InactivityService();
