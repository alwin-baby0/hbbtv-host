import { Colors, Lightning } from '@lightningjs/sdk';

export default class ProgressBar extends Lightning.Component {
  _props = { enterCallback: () => {}, index: -1, interval: null };
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
    const { backgroundBarColor, progressColor, width, height, flexItem } = this._props;

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
          Colors(backgroundBarColor).alpha(0.2).get()
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
    this._Progress.setSmooth('w', progress * this._props.width);
  }

  _clearProgressInterval() {
    clearInterval(this._progressInterval);
  }

  _inactive() {
    clearInterval(this._props.interval);
  }
}
