import { Colors, Router } from '@lightningjs/sdk';
import colors from '../reskin/colors.json';

export default class App extends Router.App {
  static _template() {
    return {
      ...super._template(),
      Pages: {
        w: 1920,
        h: 1080,
      },
      Background: {
        w: 1920,
        h: 1080,
        rect: true,
        color: Colors(colors.background).get(),
        zIndex: -900,
        // src: Utils.asset('images/background.jpg'),
      },
      Widgets: {},
    };
  }

  get _Column() {
    return this.tag('Widgets');
  }

  _init() {}

  _setup() {}

  $punchHole() {
    this.tag('Background').shader = {
      type: lng.shaders.Hole,
      x: 0,
      y: 0,
      w: 1920,
      h: 1080,
    };
  }

  $unpunchHole() {
    this.tag('Background').shader = {
      w: 0,
      h: 0,
    };
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
