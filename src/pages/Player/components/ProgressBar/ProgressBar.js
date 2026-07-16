import { Colors, Lightning } from '@lightningjs/sdk';

export default class ProgressBar extends Lightning.Component {
  _props = { enterCallback: () => { }, index: -1, interval: null, alpha: 0.2 };
  _progressValue = 0
  _realProgress = 0
  _duration = null
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
        h: height,
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
  }

  _setProgress = (progress, fireSignal) => {
    !this._props.width && (this._props.width = this.finalW);
    this._progressValue = progress
    if (fireSignal) this.signal('onProgressUpdte', this._progressValue);
    this._Progress.setSmooth('w', progress * this._props.width);
    this._Knob.setSmooth('x', progress * this._props.width);
  }

  _calculateOffset = () => {
    const holdThreshold = 1.5 * 1000
    const minSeekSeconds = 20
    const progressEquivalentOfMinimumSeekSeconds = minSeekSeconds / this._duration
    const maxOffset = 1 / 50
    let isUserHoldingSeekForMoreThanThreshold = false
    if (this._repeatStartedTimestamp && Date.now() > this._repeatStartedTimestamp + holdThreshold) {
      isUserHoldingSeekForMoreThanThreshold = true
    }
    return isUserHoldingSeekForMoreThanThreshold ? maxOffset : progressEquivalentOfMinimumSeekSeconds
  }

  _handleRight(e) {
    if (e.repeat && !this._repeatStartedTimestamp) {
      this._repeatStartedTimestamp = Date.now()
    } else if (!e.repeat) {
      this._repeatStartedTimestamp = null
    }

    const offset = this._calculateOffset()
    const progress = Math.min((this._Progress.w / this._BackgroundBar.w) + offset, 1)
    this._setProgress(progress, true)
  }

  _handleLeft(e) {
    if (e.repeat && !this._repeatStartedTimestamp) {
      this._repeatStartedTimestamp = Date.now()
    } else if (!e.repeat) {
      this._repeatStartedTimestamp = null
    }

    const offset = this._calculateOffset()
    const progress = Math.max((this._Progress.w / this._BackgroundBar.w) - offset, 0)
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
