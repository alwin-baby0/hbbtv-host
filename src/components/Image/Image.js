import { Lightning } from '@lightningjs/sdk';

export default class Image extends Lightning.Component {
  _props = {};
  static _template() {
    return {};
  }

  set props(props) {
    this._props = { ...this._props, ...props };
    const { width, height, imageSrc, radius } = this._props;
    this.patch({
      w: width,
      h: height,
      src: imageSrc,
      shader: {
        type: lng.shaders.RoundedRectangle,
        radius: radius,
      },
    });
  }

  _init() {
    this.on('txError', () => {
      this.showPlaceholder();
    });
  }

  showPlaceholder() {
    const { width, height, placeholderSrc, radius } = this._props;

    this.patch({
      w: width,
      h: height,
      src: placeholderSrc,
      shader: {
        type: lng.shaders.RoundedRectangle,
        radius: radius,
      },
    });
  }
}
