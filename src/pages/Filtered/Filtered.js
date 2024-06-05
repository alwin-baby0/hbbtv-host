import { Lightning, Utils } from '@lightningjs/sdk';
import VerticalContainer from '../../components/VerticalContainer/VerticalContainer';

export default class Filtered extends Lightning.Component {
  static _template() {
    return {
      Background: {
        w: 1920,
        h: 2080,
        src: Utils.asset('images/background.jpg'),
      },
      Wrapper: {
        x: 80,
        y: 50,
        h: 1030,
        w: 1760,
        clipping: true,
        Title: {
          w: 300,
          h: 100,
        },
        Column: {
          w: 1920,
          h: 1080,
          // y: 100,
          type: VerticalContainer,
        },
      },
    };
  }

  get _Column() {
    return this.tag('Column');
  }

  get _Title() {
    return this.tag('Title');
  }

  _getFocused() {
    return this._Column;
  }
}
