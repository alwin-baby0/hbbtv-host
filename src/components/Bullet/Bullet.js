// [ Bullet.js ]
import { Lightning, Colors, Utils, Router } from '@lightningjs/sdk';
import { imageSizes } from '../../Models/utils';
import { CATEGORY_TYPES } from '../../Models/Category';
import HeroRailItem from '../../components/RailItems/HeroRailItems';

export default class Bullet extends HeroRailItem {
  _props = {};
  static _template() {
    return {
      w: 385,
      h: 215,
      Border: {
        w: 385,
        h: 215,
        zIndex: 1,
      },
      Icon: {
        w: 385,
        h: 215,
        // rect: true,
        src: '',
      },
    };
  }

  set index(val) {
    console.log('index', val);
    return (this._index = val);
  }

  set item(val) {
    console.log('PROP', val);
    return (this._item = val);
  }

  set props(props) {
    this._props = { ...this._props, ...props };

    const { item, index } = this._props;
  }

  _firstActive() {}

  _enable() {
    const { item, index } = this._props;
    // console.log('enable item', item.props);
    // this._Icon.patch({
    //   src: item.props.getLandscapePoster(imageSizes.L)?.src,
    // });
  }

  _focus() {
    const { index } = this._props;
    console.log('FOCUSED');
    console.log('this._index', index);
    // this.fireAncestors('$nextVideo', index);

    this._Border.patch({
      // color: 0xffff0000,
      texture: lng.Tools.getRoundRect(385, 215, 8, 4, Colors('#D9D9D9').get(), false),
    });
  }

  _unfocus() {
    this._Border.patch({
      texture: undefined,
    });
  }

  _handleEnter() {
    const { item } = this._props;

    console.log('TYPE:', item.type.value);
    switch (item.type.value) {
      case CATEGORY_TYPES.MOVIE: {
        Router.navigate(`movie-details/${item.id}`);
        break;
      }
      case CATEGORY_TYPES.SERIES: {
        Router.navigate(`series-details/${item.id}`);
        break;
      }
      case CATEGORY_TYPES.EVENTS: {
        Router.navigate(`event-details/${item.id}`);
        break;
      }
      case CATEGORY_TYPES.LIVE_TV: {
        break;
      }
      case CATEGORY_TYPES.CHANNELS: {
        this.changeGenre = this.data;
        Router.navigate(`live/:${this.id}?`);
        break;
      }
      default:
        console.warn('unknown category type:', this.type);
    }
  }

  get _Icon() {
    return this.tag('Icon');
  }

  get _Border() {
    return this.tag('Border');
  }
}
