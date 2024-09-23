import { Lightning } from '@lightningjs/sdk';
import VerticalContainer from '../../Components/VerticalContainer/VerticalContainer';
import { constructRails } from '../utils';

export default class UserFavorites extends Lightning.Component {
  static _template() {
    return {
      Favorites: {
        type: VerticalContainer,
        w: 1400,
        h: 500,
        props: {
          h: 920,
        },
      },
    };
  }

  set props(props) {
    this._props = { ...this._props, ...props };
    this.tag('Favorites').patch({
      props: {
        items: constructRails(this._props.items),
      },
    });
  }

  _getFocused() {
    return this.tag('Favorites');
  }
}
