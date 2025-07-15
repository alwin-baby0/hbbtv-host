import { Colors, Router, Utils, VideoPlayer, Lightning } from '@lightningjs/sdk';
import routes from './pages/routes';
import Navbar from './components/widgets/Navbar/Navbar';
import LoadingScreenComponent from './components/LoadingScreenComponent/LoadinScreenComponent';
import Dialog from './components/widgets/Dialog/Dialog';
import { getDeviceType } from './utils/device';
import { parseTranslations, DetailService, t } from './Services';

let wasOffline = false; // Variable to track previous internet status

export default class App extends Router.App {
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
        src: Utils.asset('images/background.jpg'),
      },
      Widgets: {
        Menu: {
          zIndex: 2,
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

  get _Column() {
    return this.tag('Widgets');
  }

  get _Menu() {
    return this.tag('Widgets.Menu');
  }

  get _Background() {
    return this.tag('Background');
  }

  $setNavbarVisibility(isVisible) {
    this._Menu.setVisibility = isVisible;
  }

  _setup() {
    Router.startRouter(
      {
        ...routes,
        afterEachRoute: () => {
          // after each route update nav bar
          this._Menu.Items._updateFocus();
        },
      },
      this
    );

    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());

    this.checkNetworkStatusOnline(navigator.onLine);
  }

  async getMovie(id) {
    const movie = await DetailService.getMovie(id);
    if (movie) {
      Router.navigate('player', {
        videoUrl: movie.url,
        duration: movie.duration,
        videoId: id,
        ssai: movie.ssai,
      });
    }
  }

  _init() {
    this._translations = parseTranslations();
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
        src: Utils.asset('images/background.jpg'),
        shader: undefined,
      },
    });
  }

  $punchHoleTV(x, y, w, h, radius) {
    if (!x) {
      y = 106;
      x = 1071;
      w = 736;
      h = 412;
      radius = 20;
    }
    if (this.tag('Background')) {
      this.tag('Background').shader = {
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
          src: Utils.asset('images/background.jpg'),
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

  static language() {
    let selectedLanguage = localStorage.getItem('languageCode');

    if (!selectedLanguage) {
      selectedLanguage = navigator.language || navigator.userLanguage || 'en-';
      localStorage.setItem('languageCode', selectedLanguage.split('-')[0]);
    }

    return {
      file: Utils.asset('translations/translations.json'),
      language: selectedLanguage,
    };
  }

  handleOnline() {
    if (wasOffline) {
      VideoPlayer.play();
      const networkDialog = this.tag('Dialog');
      networkDialog.close();
      wasOffline = false;
    }
  }

  handleOffline() {
    VideoPlayer.pause();
    const networkDialog = this.tag('Dialog');
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
    const dialog = this.tag('Dialog');
    dialog.open({
      message: t(this._translations, 'exit_label'),
      actions: [
        {
          label: t(this._translations, 'no_resume'),
          action: () => {
            dialog.close();
          },
        },
        {
          label: t(this._translations, 'yes_exit'),
          action: () => {
            const device = getDeviceType();
            // Router navigation for "Yes, exit now"
            switch (device) {
              case 'metrological':
                this.application.closeApp();
                break;
              case 'tizen':
                window.tizen.application.getCurrentApplication().exit();
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
