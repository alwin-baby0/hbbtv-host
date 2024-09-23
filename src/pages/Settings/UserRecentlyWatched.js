import { Lightning } from '@lightningjs/sdk';
import VerticalContainer from '../../Components/VerticalContainer/VerticalContainer';
import { constructRails } from '../utils';

export default class UserRecentlyWatched extends Lightning.Component {
  static _template() {
    return {
      RecentlyWatched: {
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
    this.tag('RecentlyWatched').patch({
      props: {
        items: constructRails(this._props.items),
      },
    });
  }
  _getFocused() {
    return this.tag('RecentlyWatched');
  }
}
