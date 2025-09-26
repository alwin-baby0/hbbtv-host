import { Colors, Lightning } from '@lightningjs/sdk';
import colors from '../../../reskin/colors.json';
import HorizontalContainer from '../HorizontalContainer/HorizontalContainer';
import { CARD_SIZES } from '../RailItems/constants';

export default class CategoryPicker extends Lightning.Component {
  _props = {
    x: 110,
    y: 150,
  };

  static _template() {
    return {
      CaterogyItems: {
        type: HorizontalContainer,
        clipping: true,
        collision: true,
      },
    };
  }

  get _CaterogyItems() {
    return this.tag('CaterogyItems');
  }

  set props(props) {
    this._props = { ...this._props, ...props };
    const { x, y, items } = this._props;

    this._CaterogyItems.props = { items };

    this.patch({
      x: x,
      y: y,
      w: CARD_SIZES.CATEGORY.width,
      h: CARD_SIZES.CATEGORY.height,
      texture: Lightning.Tools.getRoundRect(
        CARD_SIZES.CATEGORY.width,
        CARD_SIZES.CATEGORY.height,
        30,
        6,
        Colors(colors.categoryPicker).get(),
        true,
        Colors(colors.categoryPicker).get()
      ),
      CaterogyItems: {
        w: CARD_SIZES.CATEGORY.width,
        h: CARD_SIZES.CATEGORY.height,
      },
    });
  }

  _getFocused() {
    return this._CaterogyItems;
  }
}
