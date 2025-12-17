import { Lightning } from '@lightningjs/sdk';
import HorizontalContainer from '../HorizontalContainer/HorizontalContainer';
import { CARD_SIZES } from '../../constants/globalConstants';

export default class CategoryPicker extends Lightning.Component {
  _props = {
    x: 110,
    y: 150,
    parentState: null,
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
    const { x, y, items, parentState, seasonIndex } = this._props;

    this.patch({
      x: x,
      y: y,
      w: CARD_SIZES.CATEGORY.width,
      h: CARD_SIZES.CATEGORY.height,
      color: null,
      texture: Lightning.Tools.getRoundRect(
        CARD_SIZES.CATEGORY.width,
        CARD_SIZES.CATEGORY.height,
        30,
        6
      ),
      CaterogyItems: {
        w: CARD_SIZES.CATEGORY.width,
        h: CARD_SIZES.CATEGORY.height,
        props: { ...(items && items[0].props), parentState },
      },
    });

    if (seasonIndex && seasonIndex !== -1) {
      this._CaterogyItems._focusedIndex = seasonIndex;
    }
  }

  _getFocused() {
    return this._CaterogyItems;
  }

  _handleScroll(event) {
    if (event.deltaY < 0) {
      this.fireAncestors('$setStateOnScroll', 'Hero');
    }
  }
}
