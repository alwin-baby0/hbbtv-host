import { Lightning } from '@lightningjs/sdk';

export default class Image extends Lightning.Component {
  _props = {};
  static _template() {
    return { alpha: 0.01 };
  }

  set props(props) {
    this._props = { ...this._props, ...props };
    const { width, height, imageSrc, radius } = this._props;
    this.patch({
      w: width,
      h: height,
      src: imageSrc,
      shader: {
        type: Lightning.shaders.RoundedRectangle,
        radius: radius,
      },
    });
  }

  _onTxLoadedHandler = () => {
    this.setSmooth('alpha', 1);
    if (this.texture.source) this.texture.source.permanent = true;
  };

  _init() {
    this.on('txError', () => {
      this.showPlaceholder();
    });
    this.on('txLoaded', this._onTxLoadedHandler)
  }

  _detach() {
    this.off('txLoaded', this._onTxLoadedHandler)
    if (this.texture.source) this.texture.source.permanent = false;
  }

  showPlaceholder() {
    const { width, height, placeholderSrc, radius } = this._props;

    this.patch({
      w: width,
      h: height,
      src: placeholderSrc,
      shader: {
        type: Lightning.shaders.RoundedRectangle,
        radius: radius,
      },
    });
  }
}
