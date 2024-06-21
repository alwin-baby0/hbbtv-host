import { Colors, Lightning } from '@lightningjs/sdk';
import colors from '../../../reskin/colors.json';
import HorizontalContainer from '../HorizontalContainer/HorizontalContainer';

export default class CategoryPicker extends Lightning.Component {
  _props = {
    x: 110,
    y: 150,
    height: 64,
  };

  static _template() {
    return {
      CaterogyItems: {
        type: HorizontalContainer,
        clipping: true,
      },
    };
  }

  get _CaterogyItems() {
    return this.tag('CaterogyItems');
  }

  set props(props) {
    this._props = { ...this._props, ...props };
    const { x, y, width, height, items } = this._props;

    this._CaterogyItems.props = { items };

    this.patch({
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

    this._CaterogyItems.patch({
      w: width,
      h: height,
    });
  }

  _getFocused() {
    return this._CaterogyItems;
  }
}
