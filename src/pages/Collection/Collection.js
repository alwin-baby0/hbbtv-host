import { Lightning } from '@lightningjs/sdk';
import { constructRails } from '../utils';
import VerticalContainer from '../../Components/VerticalContainer/VerticalContainer';

export default class Collection extends Lightning.Component {
  _props = {};
  static _template() {
    return {
      Wrapper: {
        w: 1920,
        h: 1080,
        // Title: {
        //   w: 1670,
        //   h: 40,
        //   x: 100,
        //   y: 150,
        //   text: {
        //     fontSize: 33,
        //     lineHeight: 40,
        //     fontFace: 'Montserrat-Medium',
        //   },
        // },
        Column: {
          w: 1700,
          h: 600,
          x: 100,
          y: 150,
          type: VerticalContainer,
        },
      },
    };
  }

  set props(props) {
    this._props = { ...this._props, ...props };
    const { items } = this._props;
    console.log('items', items);
  }

  _enable() {
    const { items } = this._props;

    // this._Title.patch({
    //   text: {
    //     text: items.railTitle,
    //   },
    // });

    const rails = constructRails(items);
    console.log('RRR', rails);
    this._Column.props = { items: rails };
  }

  // get _Title() {
  //   return this.tag('Title');
  // }

  get _Column() {
    return this.tag('Column');
  }

  _getFocused() {
    return this._Column;
  }

  static _states() {
    return [];
  }
}
