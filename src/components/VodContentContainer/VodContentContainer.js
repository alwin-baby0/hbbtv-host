import Lightning from '@lightningjs/sdk/src/Lightning';
import CategoryPicker from '../CategoryPicker/CategoryPicker';
import VerticalContainer from '../VerticalContainer/VerticalContainer';
import { CONTENT_TYPE } from '../../constants/globalConstants';

// export const CONTENT_TYPE = {
//   CATEGORIES: '_Categories',
//   EVENTS: '_LiveEvents',
//   EMPTY: 'empty',
// };

export default class VodContentContainer extends Lightning.Component {
  _props = {
    contentType: CONTENT_TYPE.EMPTY,
    parentState: null,
  };

  static _template() {
    return {
      h: 200,
      Categories: {
        type: CategoryPicker,
        props: {
          x: 90,
          y: 150,
        },
      },
      LiveEvents: {
        type: VerticalContainer,
        collision: true,
        x: 90,
        y: 150,
        h: 500,
        w: 1920,
      },
    };
  }

  set props(props) {
    this._props.parentState = props.parentState;
    const { contentType, items } = props;

    this._props.contentType = contentType;

    this.#changeContentVisibility(contentType);
    this.#renderContent(items, contentType);

    if (contentType === CONTENT_TYPE.CATEGORIES) {
      this._Categories._CaterogyItems._setFocusedIndex(0);
    }
  }

  /**
   * Resets visibility of content containers.
   * @param {string} visibleContentType - type of container to show.
   */
  #changeContentVisibility(visibleContentType) {
    Object.values(CONTENT_TYPE).forEach((contentType) => {
      // escape empty state
      if (contentType === CONTENT_TYPE.EMPTY) return;
      this[contentType].visible = visibleContentType === contentType;
    });
  }

  /**
   * Initiates content container with items.
   * @param {Rails[]} items - items to add to container props.
   * @param {string} contentType - type of container to populate.
   */
  #renderContent(items, contentType) {
    if (items) {
      if (items !== this._props.items) {
        this._props.items = items;

        this[contentType].props = { items };
      }
      // content is empty
      if (items.length === 0) {
        this._props.contentType = CONTENT_TYPE.EMPTY;
      }
    }
  }

  _getFocused() {
    switch (this._props.contentType) {
      case CONTENT_TYPE.CATEGORIES:
        return this._Categories;
      case CONTENT_TYPE.EVENTS:
        return this._LiveEvents;
      case CONTENT_TYPE.EMPTY:
      default:
        return null;
    }
  }

  get contentType() {
    return this._props.contentType;
  }

  get _Categories() {
    return this.tag('Categories');
  }

  get _LiveEvents() {
    return this.tag('LiveEvents');
  }
}
