import { Colors, Router, Lightning } from '@lightningjs/sdk';
import { CATEGORY_TYPES } from '../../Models/Category';
import HeroRailItem from '../../components/RailItems/HeroRailItems';
import { ROUTES } from '../../constants/globalConstants';

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
        src: '',
      },
    };
  }

  set index(val) {
    return (this._index = val);
  }

  set item(val) {
    return (this._item = val);
  }

  set props(props) {
    this._props = { ...this._props, ...props };
  }

  _focus() {
    this._Border.patch({
      texture: Lightning.Tools.getRoundRect(385, 215, 8, 4, Colors('#D9D9D9').get(), false),
    });
  }

  _unfocus() {
    this._Border.patch({
      texture: undefined,
    });
  }

  _handleEnter() {
    if (didomiVisible) {
      return true;
    }

    const { item } = this._props;

    switch (item.type.value) {
      case CATEGORY_TYPES.MOVIE: {
        Router.navigate(`${ROUTES.MOVIE_DETAILS}/${item.id}`);
        break;
      }
      case CATEGORY_TYPES.SERIES: {
        Router.navigate(`${ROUTES.SERIES_DETAILS}/${item.id}`);
        break;
      }
      case CATEGORY_TYPES.EVENTS: {
        Router.navigate(`${ROUTES.EVENT_DETAILS}/${item.id}`);
        break;
      }
      case CATEGORY_TYPES.LIVE_TV: {
        break;
      }
      case CATEGORY_TYPES.CHANNELS: {
        this.changeGenre = this.data;
        Router.navigate(`${ROUTES.LIVE}/:${this.id}?`);
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
