import { Lightning } from '@lightningjs/sdk';
import VerticalContainer from '../../components/VerticalContainer/VerticalContainer';

export default class Collection extends Lightning.Component {
  _props = {};
  static _template() {
    return {
      Wrapper: {
        w: 1920,
        h: 1080,
        Column: {
          collision: true,
          w: 1700,
          h: 600,
          x: 100,
          y: 150,
          type: VerticalContainer,
        },
      },
    };
  }

  set props(props) {
    this._props = { ...this._props, ...props };
  }

  get _Column() {
    return this.tag('Column');
  }

  _getFocused() {
    return this._Column;
  }

  static _states() {
    return [];
  }
}
