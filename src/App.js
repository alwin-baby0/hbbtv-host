// App.js
import { Colors, Router, Utils } from '@lightningjs/sdk';
import colors from '../reskin/colors.json';
import routes from './pages/routes';
import Navbar from './components/widgets/Navbar/Navbar';
import LoadingScreenComponent from './components/LoadingScreenComponent/LoadinScreenComponent';

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
      },
      Background: {
        w: 1920,
        h: 1080,
        rect: true,
        color: Colors(colors.background).get(),
        zIndex: -900,
        // src: Utils.asset('images/background.jpg'),
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

  $hideNavbar(isVisible) {
    isVisible ? (this._Menu.visible = true) : (this._Menu.visible = false);
  }

  _setup() {
    Router.startRouter({
      ...routes,
      afterEachRoute: () => {
        // after each route update nav bar
        this._Menu.Items._updateFocus();
      },
    }, this);
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

  static getFonts() {
    return [
      {
        family: 'Inter',
        url: Utils.asset('fonts/Inter.ttf'),
        descriptors: {},
      },
    ];
  }

  _handleAppClose() { }

  /**
   * Show app close dialogue
   * @private
   */
  // _handleAppClose() {
  //   console.log('Close app');
  // }
}
