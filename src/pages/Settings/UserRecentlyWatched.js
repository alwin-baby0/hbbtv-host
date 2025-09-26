import { Lightning } from '@lightningjs/sdk';
import VerticalContainer from '../../components/VerticalContainer/VerticalContainer';
import { constructRails } from '../utils';

export default class UserRecentlyWatched extends Lightning.Component {
  static _template() {
    return {
      RecentlyWatched: {
        collision: true,
        type: VerticalContainer,
        w: 1450,
        h: 500,
        props: {
          h: 920,
          w: 1450,
        },
      },
    };
  }

  get _RecentlyWatched() {
    return this.tag('RecentlyWatched');
  }

  set props(props) {
    this._props = { ...this._props, ...props };
    this._RecentlyWatched.patch({
      props: {
        items: constructRails(this._props.items),
      },
    });
  }

  _getFocused() {
    return this._RecentlyWatched;
  }
}
