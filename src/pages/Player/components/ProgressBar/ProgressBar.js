import { Colors, Lightning } from '@lightningjs/sdk';

export default class ProgressBar extends Lightning.Component {
  _props = { enterCallback: () => { }, index: -1, interval: null, alpha: 0.2 };
  _progressValue = 0
  static _template() {
    return {
      BackgroundBar: {
        rect: true,
      },
      Progress: {
        rect: true,
        w: 0,
      },
    };
  }

  get _BackgroundBar() {
    return this.tag('BackgroundBar');
  }

  get _Progress() {
    return this.tag('Progress');
  }

  set props(props) {
    this._props = { ...this._props, ...props };
    const { backgroundBarColor, progressColor, width, height, flexItem, alpha } = this._props;

    this.patch({
      flexItem: flexItem ? flexItem : {},
      w: width,
      h: height,
      BackgroundBar: {
        texture: Lightning.Tools.getRoundRect(
          1404,
          9,
          0,
          0,
          undefined,
          true,
          Colors(backgroundBarColor).alpha(alpha).get()
        ),
        h: height,
        w: width,
      },
      Progress: {
        color: Colors(progressColor).get(),
        h: height,
      },
    });
  }

  progress(progress) {
    !this._props.width && (this._props.width = this.finalW);
    this._progressValue = progress
    this._Progress.setSmooth('w', progress * this._props.width);
  }

  _handleRight() {
    const progress = Math.min((this._Progress.w / this._BackgroundBar.w) + (1 / 50), 1)
    this.progress(progress)
  }

  _handleLeft() {
    const progress = Math.max((this._Progress.w / this._BackgroundBar.w) - (1 / 50), 0)
    this.progress(progress)
  }

  _handleEnter() {
    this.signal('onProgressBarEnter', this._progressValue);
  }

  _focus() {
    this.setSmooth('scaleY', 1.5)
  }

  _unfocus() {
    this.setSmooth('scaleY', 1)
  }

  _clearProgressInterval() {
    clearInterval(this._progressInterval);
  }

  _inactive() {
    clearInterval(this._props.interval);
  }
}
