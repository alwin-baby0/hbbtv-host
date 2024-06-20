import Lightning from "@lightningjs/sdk/src/Lightning";
import CategoryPicker from "../CategoryPicker/CategoryPicker";
import VerticalContainer from "../VerticalContainer/VerticalContainer";

export const CONTENT_TYPE = {
  CATEGORIES: 'categories',
  EVENTS: 'events',
}

export default class VodContentContainer extends Lightning.Component {
  _props = {
    contentType: undefined,
  }
  static _template() {
    return {
      h: 200,
      Categories: {
        type: CategoryPicker,
        props: {
          x: 110,
          y: 150,
          width: 1760,
          height: 64,
        },
      },
      LiveEvents: {
        type: VerticalContainer,
        collision: true,
        x: 110,
        y: 150,
        h: 500,
        w: 1920,
      },
    }
  }

  set props(props) {
    const { contentType } = props;

    this._props.contentType = contentType;

    if (contentType === CONTENT_TYPE.CATEGORIES) {
      this._Categories.visible = true;
      this._LiveEvents.visible = false;

      const { categoryItems } = props;

      if (categoryItems && categoryItems !== this._props.categoryItems) {
        this._props = { ...this._props, ...props };

        this._Categories._CaterogyItems.props = {
          items: categoryItems,
        };
      }
    } else if (contentType === CONTENT_TYPE.EVENTS) {
      this._Categories.visible = false;
      this._LiveEvents.visible = true;
      const { eventItems } = props;

      if (eventItems && eventItems !== this._props.eventItems) {
        this._props = { ...this._props, ...props };

        this._LiveEvents.props = {
          items: eventItems,
        };
      }
    }
  }

  _getFocused() {
    switch (this._props.contentType) {
      case CONTENT_TYPE.CATEGORIES: return this._Categories;
      case CONTENT_TYPE.EVENTS: return this._LiveEvents;
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