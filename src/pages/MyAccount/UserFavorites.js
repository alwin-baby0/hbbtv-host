import { Lightning } from '@lightningjs/sdk';
import VerticalContainer from '../../components/VerticalContainer/VerticalContainer';
import { constructRails } from '../utils';

export default class UserFavorites extends Lightning.Component {
  _props = {
    parentState: null,
  };

  static _template() {
    return {
      Favorites: {
        collision: true,
        type: VerticalContainer,
        w: 1450,
        h: 500,
        props: {
          w: 1450,
          h: 920,
        },
      },
    };
  }

  get _Favorites() {
    return this.tag('Favorites');
  }

  set props(props) {
    this._props = { ...this._props, ...props };
    this._Favorites.patch({
      props: {
        items: constructRails(this._props.items),
        parentState: this._props.parentState,
        railTitle: this._props.railTitle,
      },
    });
  }

  _getFocused() {
    return this._Favorites;
  }
}
