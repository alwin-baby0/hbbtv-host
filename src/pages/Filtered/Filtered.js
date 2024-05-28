import { Lightning, Utils } from '@lightningjs/sdk';
import { Column } from '@lightningjs/ui-components';
import VerticalContainer from '../../components/VerticalContainer/VerticalContainer';
import HorizontalContainer from '../../components/HorizontalContainer/HorizontalContainer';

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
          type: VerticalContainer,
          // plinko: true,
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

  _init() {}

  _getFocused() {
    return this._Column;
  }

  static _states() {
    return [];
  }
}
