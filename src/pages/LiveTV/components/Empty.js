import { Lightning } from '@lightningjs/sdk';

export default class Empty extends Lightning.Component {
  _props = {};
  static _template() {
    return {
      h: 50,
      w: 60,
    };
  }

  _getFocused() {}
}
