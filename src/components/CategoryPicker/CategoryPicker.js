import { Colors, Lightning } from '@lightningjs/sdk';
import { Row } from '@lightningjs/ui-components';
import colors from '../../../reskin/colors.json';

export default class CategoryPicker extends Lightning.Component {
  _props = {
    x: 110,
    y: 150,
    width: 1700,
    height: 64,
  };
  static _template() {
    return {
      Wrapper: {
        w: 1700,
        x: 110,
        y: 150,
        h: 64,
        clipping: true,
        CaterogyItem: {
          type: Row,
          scrollIndex: 8,
          /* lazyScroll: true,
          startLazyScrollIndex: 0,
          stopLazyScrollIndex: 8, */
        },
      },
    };
  }

  get _Wrapper() {
    return this.tag('Wrapper');
  }

  get _CaterogyItem() {
    return this.tag('CaterogyItem');
  }

  set props(props) {
    this._props = { ...this._props, ...props };
    const { x, y, width, height } = this._props;
    this._Wrapper.patch({
      x: x,
      y: y,
      w: width,
      h: height,
      texture: Lightning.Tools.getRoundRect(
        width,
        height,
        30,
        6,
        Colors(colors.categoryPicker).get(),
        true,
        Colors(colors.categoryPicker).get()
      ),
    });
  }

  _getFocused() {
    return this._CaterogyItem;
  }
}
