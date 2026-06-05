import { Colors, Router, Utils, VideoPlayer, Lightning } from '@lightningjs/sdk';
import routes from './routes';
import Navbar from './components/widgets/Navbar/Navbar';
import LoadingScreenComponent from './components/LoadingScreenComponent/LoadinScreenComponent';
import Dialog from './components/widgets/Dialog/Dialog';
import { getDeviceType } from './utils/device';
import { DetailService, DidomiService, InactivityService } from './Services';
import { IMG_PATH, ROUTES, TRANSLATIONS } from './constants/globalConstants';
import { Lifecycle, Metrics } from '@firebolt-js/sdk';
import { t } from './utils';
import { unload } from './components/Player/HLS';

let wasOffline = false; // Variable to track previous internet status
export let didomiVisible = false;

export const setDidomiVisible = (value) => {
  didomiVisible = value;
};

export default class App extends Router.App {
  enteredApp = 0;
  settingsDidomi = false;

  static _template() {
    return {
      ...super._template(),
      Pages: {
        collision: true,
        w: 1920,
        h: 1080,
      },
      Loading: {
        type: LoadingScreenComponent,
        rect: true,
        w: 1920,
        h: 1080,
        zIndex: 102,
        color: Colors('#000000').get(),
        props: {
          xPos: 960,
          yPos: 540,
        },
      },
      Background: {
        w: 1920,
        h: 1080,
        zIndex: -900,
        src: Utils.asset(IMG_PATH.BACKGROUND),
      },
      Widgets: {
        Menu: {
          zIndex: 3,
          type: Navbar,
        },
        Dialog: {
          visible: false,
          type: Dialog,
          zIndex: 101,
        },
      },
    };
  }

  get _Menu() {
    return this.tag('Widgets.Menu');
  }

  get _Background() {
    return this.tag('Background');
  }

  get _Dialog() {
    return this.tag('Dialog');
  }

  $setNavbarVisibility(isVisible) {
    this._Menu.setVisibility = isVisible;
  }

  _handleRedButton() {
    if (window.isRedButtonEnabled && !window.isRedButtonEnabled()) return true
    this.$appClose()
  }

  closeHbbTvApp() {
    if (window.disableRedButton) window.disableRedButton()
    if (window.showSplash) window.showSplash()
    const video = document.getElementById('video-player');
    if (video) {
      video.pause()
      unload(video)
      video.remove()
    }
    InactivityService.stop();
    this.application.closeApp();
    this.removeCanvasAndLightningScripts()
    if (window.hideAppAndShowBroadcast) window.hideAppAndShowBroadcast()
  }

  removeCanvasAndLightningScripts = () => {
    const canvas = document.body.querySelector('canvas');
    if (canvas) {
      canvas.remove()
    }

    const polyfillScript = document.getElementById('vite-legacy-polyfill');
    if (polyfillScript) {
      polyfillScript.remove();
    }

    const entryScript = document.getElementById('vite-legacy-entry');
    if (entryScript) {
      entryScript.remove();
    }

    // Remove google tag manager script from head
    const googleTagScript = document.querySelector('script[src*="googletagmanager"]');
    if (googleTagScript) {
      googleTagScript.remove();
    }

    // Remove tracking.watch4.com script from body
    const trackingScript = document.querySelector('script[src*="tracking.watch4.com"]');
    if (trackingScript) {
      trackingScript.remove();
    }
  }

  _setup() {
    Router.startRouter(
      {
        ...routes,
        afterEachRoute: () => {
          // after each route update nav bar
          this._Menu.Items._updateFocus();
          InactivityService.notifyRouteChanged();
        },
      },
      this
    );

    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());

    this.checkNetworkStatusOnline(navigator.onLine);
    InactivityService.start();
  }

  async _init() {
    const analyticsAllowed = DidomiService.hasConsentForPurpose('analytics');

    if (analyticsAllowed) {
      this.startAnalytics();
    }

    DidomiService.onConsentChanged(() => {
      this.handleConsentUpdate();
    });
  }

  _captureKey() {
    if (Router.isNavigating()) {
      return true;
    }

    InactivityService.reset();
    return false;
  }

  _captureEnter() {
    if (this.settingsDidomi) {
      return false;
    }

    if (this.enteredApp === 1) {
      didomiVisible = false;
      this.enteredApp = 0;
      return false;
    }

    if (didomiVisible && this.enteredApp === 0) {
      this.enteredApp = 1;
      return true;
    }

    return false;
  }

  $didomiVisible(didomiVisibility) {
    didomiVisible = didomiVisibility;
  }

  $settingsDidomi(value) {
    this.settingsDidomi = value;
  }

  startAnalytics() {
    console.log('Analytics started');
  }

  async handleConsentUpdate() {
    if (DidomiService.hasConsentForPurpose('analytics')) {
      this.startAnalytics();
    } else {
      console.log('Analytics disabled');
    }
  }

  async getMovie(id) {
    const movie = await DetailService.getMovie(id);
    if (movie) {
      Router.navigate(ROUTES.PLAYER, {
        videoUrl: movie.url,
        duration: movie.duration,
        videoId: id,
        ssai: movie.ssai,
      });
    }
  }

  $punchHole() {
    this.patch({
      Background: undefined,
    });
  }

  $unpunchHole() {
    this.patch({
      Background: {
        w: 1920,
        h: 1080,
        zIndex: -900,
        src: Utils.asset(IMG_PATH.BACKGROUND),
        shader: undefined,
      },
    });
  }

  $punchHoleTV(x, y, w, h, radius) {
    if (!x && x !== 0) {
      y = 152;
      x = 1071;
      w = 734;
      h = 409;
      radius = 20;
    }
    if (this._Background) {
      this._Background.shader = {
        type: Lightning.shaders.Hole,
        x: x,
        y: y,
        w: w,
        h: h,
        radius: radius,
      };
    } else {
      this.patch({
        Background: {
          w: 1920,
          h: 1080,
          zIndex: -900,
          src: Utils.asset(IMG_PATH.BACKGROUND),
          shader: {
            type: Lightning.shaders.Hole,
            x: x,
            y: y,
            w: w,
            h: h,
            radius: radius,
          },
        },
      });
    }
  }

  static getFonts() {
    return [
      // 300
      {
        family: 'Montserrat-Light',
        url: Utils.asset('fonts/Montserrat/Montserrat-Light.ttf'),
        descriptors: {},
      },
      // 400
      {
        family: 'Montserrat-Regular',
        url: Utils.asset('fonts/Montserrat/Montserrat-Regular.ttf'),
        descriptors: {},
      },
      // 500
      {
        family: 'Montserrat-Medium',
        url: Utils.asset('fonts/Montserrat/Montserrat-Medium.ttf'),
        descriptors: {},
      },
      // 600
      {
        family: 'Montserrat-SemiBold',
        url: Utils.asset('fonts/Montserrat/Montserrat-SemiBold.ttf'),
        descriptors: {},
      },
      // 700
      {
        family: 'Montserrat-Bold',
        url: Utils.asset('fonts/Montserrat/Montserrat-Bold.ttf'),
        descriptors: {},
      },
      // 800
      {
        family: 'Montserrat-ExtraBold',
        url: Utils.asset('fonts/Montserrat/Montserrat-ExtraBold.ttf'),
        descriptors: {},
      },
    ];
  }

  handleOnline() {
    if (wasOffline) {
      VideoPlayer.play();
      const networkDialog = this._Dialog;
      networkDialog.close();
      wasOffline = false;
    }
  }

  handleOffline() {
    VideoPlayer.pause();
    const networkDialog = this._Dialog;
    networkDialog.open({
      message: 'Problem with Network?',
      actions: [
        {
          label: 'Retry',
          action: () => {
            if (navigator.onLine) {
              networkDialog.close();
              wasOffline = true;
              this.handleOnline();
            }
          },
        },
        {
          label: 'Exit App',
          action: () => {
            this.application.closeApp();
          },
        },
      ],
    });
    wasOffline = true;
    const deviceType = getDeviceType();
    deviceType === 'metrological' &&
      Metrics.error(Metrics.ErrorType.NETWORK, 'Offline', 'Bad network connection', true);
  }

  checkNetworkStatusOnline(isOnline) {
    if (isOnline) {
      this.handleOnline();
    } else {
      this.handleOffline();
    }
  }

  $exitApp() {
    this.application.closeApp();
  }

  $appClose() {
    const dialog = this._Dialog;
    dialog.open({
      message: t(TRANSLATIONS.EXIT),
      actions: [
        {
          label: t(TRANSLATIONS.NO_RESUME),
          action: () => {
            dialog.close();
          },
        },
        {
          label: t(TRANSLATIONS.YES_EXIT),
          action: async () => {
            const device = getDeviceType();
            // Router navigation for "Yes, exit now"
            switch (device) {
              case 'metrological':
                await Lifecycle.close('userExit');
                Lifecycle.listen('unloading', async () => {
                  await Lifecycle.finished();
                });
                this.application.closeApp();
                break;
              case 'tizen':
                // TODO: change the logic
                this.closeHbbTvApp()
                // window.tizen.application.getCurrentApplication().exit();
                break;
              default:
                window.close();
                break;
            }
          },
        },
      ],
    });
  }
}
