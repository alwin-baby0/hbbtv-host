import { Lightning } from '@lightningjs/sdk';

export default class EPGTimeSlot extends Lightning.Component {
  _props = {};
  static _template() {
    return {
      flexItem: { marginLeft: 0, marginRight: 0 },
      h: 50,
      w: 60,
      Text: {
        x: -18,
        text: {
          text: 'HH',
          fontSize: 18,
          fontFace: 'Montserrat-Regular',
        },
      },
    };
  }

  get _Text() {
    return this.tag('Text');
  }

  set props(props) {
    this._props = { ...this._props, ...props };
    this._Text.patch({
      text: props.startTime,
    });
  }

  _focus() {
    this.patch({
      color: 0xffffff00,
    });
  }

  _unfocus() {
    this.patch({
      color: 0xffff0000,
    });
  }

  _init() { }

  _getFocused() { }

  static _states() {
    return [];
  }
}
