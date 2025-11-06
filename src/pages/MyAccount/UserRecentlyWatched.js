import { Lightning } from '@lightningjs/sdk';
import VerticalContainer from '../../components/VerticalContainer/VerticalContainer';
import { constructRails } from '../utils';

export default class UserRecentlyWatched extends Lightning.Component {
  _props = {
    parentState: null,
  };

  static _template() {
    return {
      RecentlyWatched: {
        collision: true,
        type: VerticalContainer,
        w: 1450,
      },
    };
  }

  get _RecentlyWatched() {
    return this.tag('RecentlyWatched');
  }

  set props(props) {
    this._props = { ...this._props, ...props };
    this._RecentlyWatched.patch({
      h: !this._props.items || !this._props.items.length ? 95 : 500,
      props: {
        items: constructRails(this._props.items),
        parentState: this._props.parentState,
        railTitle: this._props.railTitle,
        h: !this._props.items || !this._props.items.length ? 0 : 920,
        w: 1450,
      },
    });
  }

  _getFocused() {
    console.log('UserRecentlyWatched focused');
    return this._RecentlyWatched;
  }
}
