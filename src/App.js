// App.js
import { Colors, Router, Utils } from '@lightningjs/sdk';
import colors from '../reskin/colors.json';
import Lightning from '@lightningjs/sdk/src/Lightning';
import routes from './Pages/routes';
import Navbar from './Components/widgets/Navbar/Navbar';
import LoadingScreenComponent from './Components/LoadingScreenComponent/LoadinScreenComponent';
let keys = [
  'MediaPlay',
  'MediaPause',
  'MediaStop',
  'ColorF0Red',
  'ColorF1Green',
  'ColorF2Yellow',
  'ColorF3Blue',
  'ChannelUp',
  'ChannelDown',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'MediaRewind',
  'MediaFastForward',
  'MediaRecord',
  'MediaPlayPause',
];
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
  }

  $punchHole() {
    this._Background.shader = {
      type: lng.shaders.Hole,
      x: 0,
      y: 0,
      w: 1920,
      h: 1080,
    };
  }

  $unpunchHole() {
    this._Background.shader = {
      w: 0,
      h: 0,
    };
  }

  /* $punchHoleTV(x, y, w, h) {
    y = 105;
    x = 1065;
    w = 736;
    h = 412;
    this.tag('Background').shader = {
      type: Lightning.shaders.Hole,
      x,
      y,
      w,
      h,
    };
  } */
  $punchHoleTV(x, y, w, h) {
    if (!x) {
      y = 106;
      x = 1071;
      w = 736;
      h = 412;
    }
    const radius = 20; // Set your desired radius here
    this.tag('Background').shader = {
      type: Lightning.shaders.Hole,
      x: x,
      y: y,
      w: w,
      h: h,
      radius: radius,
    };
  }

  $unpunchHoleTV() {
    this.tag('Background').shader = {
      w: 0,
      h: 0,
    };
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

  _handleAppClose() {}

  /**
   * Show app close dialogue
   * @private
   */
  // _handleAppClose() {
  //   console.log('Close app');
  // }
}
