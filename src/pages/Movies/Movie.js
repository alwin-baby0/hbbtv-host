import { Lightning, Router, Utils } from '@lightningjs/sdk';
import CategoryPicker from '../../components/CategoryPicker/CategoryPicker';

export default class Movies extends Lightning.Component {
  static _template() {
    return {
      Background: {
        w: 1920,
        h: 1080,
        src: Utils.asset('images/background.jpg'),
      },
      Categories: {
        type: CategoryPicker,
      },
    };
  }

  get _Categories() {
    return this.tag('Categories');
  }

  get _CaterogyItem() {
    return this.tag('Categories.CaterogyItem');
  }

  _handleUp() {
    Router.focusWidget('Menu');
  }

  _getFocused() {
    return this._Categories;
  }
}
