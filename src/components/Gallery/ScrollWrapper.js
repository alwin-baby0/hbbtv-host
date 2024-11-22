import { Lightning } from '@lightningjs/sdk';

export default class ScrollWrapper extends Lightning.Component {
  static _template() {
    return {
      collision: true,
      w: 1920,
      h: 600,
      rect: true, // Add a visible rectangle to ensure collision testing
      color: 0xff0000ff, // Blue color for debugging
      zIndex: 10,
    };
  }

  _init() {}

  _getFocused() {}

  _handleHover() {
    console.log('hoverovan skrol wrap');
  }

  _handleScroll(event) {
    console.log('scroll');
    if (event.deltaY > 0) {
      this.fireAncestors('$setStateOnScroll');
    } else if (event.deltaY < 0) {
      return;
    }
  }

  static _states() {
    return [];
  }
}
