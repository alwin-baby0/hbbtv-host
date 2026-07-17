import { Colors, Lightning } from '@lightningjs/sdk';

const HOLD_THRESHOLD_MS = 1.5 * 1000;
const MIN_SEEK_SECONDS = 20;
const MAX_OFFSET = 1 / 100;

export default class ProgressBar extends Lightning.Component {
  _props = { enterCallback: () => { }, index: -1, interval: null, alpha: 0.2 };
  _progressValue = 0
  _realProgress = 0
  _duration = null
  _minSeekOffset = 0
  _repeatStartedTimestamp = null
  static _template() {
    return {
      BackgroundBar: {
        rect: true,
      },
      Progress: {
        rect: true,
        w: 0,
      },
      Knob: {
        rect: true,
        mount: 0.5,
        alpha: 0,
      }
    };
  }

  get _BackgroundBar() {
    return this.tag('BackgroundBar');
  }

  get _Progress() {
    return this.tag('Progress');
  }

  get _Knob() {
    return this.tag('Knob');
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
        h: height * 1.1,
        w: width,
      },
      Progress: {
        color: Colors(progressColor).get(),
        h: height,
      },
      Knob: {
        texture: Lightning.Tools.getRoundRect(
          height * 3.6,
          height * 3.6,
          height * 1.8,
          0,
          undefined,
          true,
          Colors('white').alpha(1).get()
        ),
        y: height / 2
      }
    });
  }

  progress(progress, fireSignal) {
    this._realProgress = progress
    this._setProgress(progress, fireSignal)
  }

  duration(duration) {
    this._duration = duration
    this._minSeekOffset = MIN_SEEK_SECONDS / duration
  }

  _setProgress = (progress, fireSignal) => {
    !this._props.width && (this._props.width = this.finalW);
    this._progressValue = progress
    if (fireSignal) this.signal('onProgressUpdte', this._progressValue);
    this._Progress.setSmooth('w', progress * this._props.width);
    this._Knob.setSmooth('x', progress * this._props.width);
  }

  _calculateOffset = () => {
    if (this._repeatStartedTimestamp && Date.now() > this._repeatStartedTimestamp + HOLD_THRESHOLD_MS) {
      return MAX_OFFSET
    }
    return this._minSeekOffset
  }

  _handleRight(e) {
    if (e.repeat && !this._repeatStartedTimestamp) {
      this._repeatStartedTimestamp = Date.now()
    } else if (!e.repeat) {
      this._repeatStartedTimestamp = null
    }

    const progress = Math.min(this._progressValue + this._calculateOffset(), 1)
    this._setProgress(progress, true)
  }

  _handleLeft(e) {
    if (e.repeat && !this._repeatStartedTimestamp) {
      this._repeatStartedTimestamp = Date.now()
    } else if (!e.repeat) {
      this._repeatStartedTimestamp = null
    }

    const progress = Math.max(this._progressValue - this._calculateOffset(), 0)
    this._setProgress(progress, true)
  }

  _handleEnter() {
    this._realProgress = this._progressValue
    this.signal('onProgressBarEnter', this._progressValue);
  }

  _focus() {
    this._BackgroundBar.setSmooth('scaleY', 1.25)
    this._Progress.setSmooth('scaleY', 1.25)
    this._Knob.patch({ alpha: 1 })
  }

  _unfocus() {
    this._setProgress(this._realProgress)
    this._BackgroundBar.setSmooth('scaleY', 1)
    this._Progress.setSmooth('scaleY', 1)
    this._Knob.patch({ alpha: 0 })
  }

  _clearProgressInterval() {
    clearInterval(this._progressInterval);
  }

  _inactive() {
    clearInterval(this._props.interval);
  }
}
