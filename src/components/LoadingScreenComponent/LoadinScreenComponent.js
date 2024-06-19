import { Utils } from '@lightningjs/sdk';
import lng from '@lightningjs/core';

export default class LoadingScreenComponent extends lng.Component {
  static _template() {
    return {
      Spinner: {
        x: 960,
        y: 540,
        w: 80,
        h: 80,
        texture: lng.Tools.getSvgTexture(Utils.asset('images/spinner.svg'), 80, 80),
        mount: 0.5,
        rotation: 0,
      },
    };
  }

  _init() {
    this._spin();
  }

  _spin() {
    this.tag('Spinner')
      .animation({
        duration: 2, // animation duration in seconds
        repeat: -1, // repeat indefinitely
        actions: [
          { p: 'rotation', v: { 0: 0, 1: 10 * Math.PI } }, // rotate 360 degrees
        ],
      })
      .start();
  }
}
