import { Lightning } from '@lightningjs/sdk';
import { constructRails } from '../utils';
import HorizontalContainer from '../../components/HorizontalContainer/HorizontalContainer';

export default class UserRecentlyWatched extends Lightning.Component {
  _props = {
    parentState: 'UserRecentlyWatched',
  };

  static _template() {
    return {
      collision: true,
      RecentlyWatched: {
        collision: true,
        type: HorizontalContainer,
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
      h: !this._props.items || !this._props.items.length ? 95 : 320,
      props: {
        items: constructRails(this._props.items),
        parentState: this._props.parentState,
        railTitle: this._props.railTitle,
        h: !this._props.items || !this._props.items.length ? 320 : 0,
      },
    });
  }

  $handleStateHover() {
    this.fireAncestors(
      '$handleStateHover',
      this.parent.children.indexOf(this),
      this._props.parentState
    );
  }

  $horizontalContainerIndexChange(index) {
    this.fireAncestors('$horizontalContainerIndexChange', index, 'RecentlyWatched');
  }

  _getFocused() {
    return this._RecentlyWatched;
  }
}
