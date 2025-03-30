import { Colors, Utils, VideoPlayer } from '@lightningjs/sdk';
import lng from '@lightningjs/core';
import colors from '../../../../../reskin/colors.json';

export default class PlayerButtons extends lng.Component {
  _props = {
    buttonInfo: {},
    isStopped: false,
  };

  static _template() {
    return {
      h: 100,
      w: 120,
      flex: { direction: 'row', justifyContent: 'center', alignItems: 'center' },
      Button: {
        flex: { direction: 'row', alignItems: 'center' },
        h: 90,
        Icon: {
          color: Colors(colors.unfocus).alpha(0.3).get(),
        },
      },
    };
  }

  set props(props) {
    this._props = { ...this._props, ...props };
  }

  get _Button() {
    return this.tag('Button');
  }

  get _Icon() {
    return this.tag('Icon');
  }

  _enable() {
    const { buttonInfo } = this._props;
    const width = buttonInfo.label === 'pause' ? 90 : 66;
    const height = buttonInfo.label === 'pause' ? 90 : 66;
    this._Icon.patch({
      // x: buttonInfo.position,
      texture: lng.Tools.getSvgTexture(Utils.asset(buttonInfo.icon), width, height),
    });
  }

  _handleEnter(e) {
    const { buttonInfo, isStopped } = this._props;
    this.fireAncestors('$changeFocusOnControl', true);
    switch (buttonInfo.label) {
      case 'forward':
        this._handleForward();
        break;
      case 'backward':
        this._handleBackward();
        break;
      case 'pause':
        this._handlePause(isStopped);
        break;
      case 'subtitles':
        this._handleSubtitles();
        break;
      case 'back':
        this._handleBack(e);
        break;
      default:
        break;
    }
  }

  _handleForward() {
    this._props.isStopped = false;
    this.fireAncestors('$skippingTime', true);
    this.fireAncestors('$startStopVideo', false);
  }

  _handleBackward() {
    this.fireAncestors('$skippingTime', false);
    this.fireAncestors('$startStopVideo', false);
  }

  _handlePause(isStopped) {
    this._props.isStopped = !isStopped;
    const isPlaying = VideoPlayer.playing;

    if (isPlaying) {
      this._Icon.patch({
        texture: lng.Tools.getSvgTexture(Utils.asset('/icons/player/play.svg'), 60, 60),
      });
      this.fireAncestors('$pauseVideo');
    } else {
      this._Icon.patch({
        texture: lng.Tools.getSvgTexture(Utils.asset('/icons/player/pause.svg'), 60, 60),
      });
      this.fireAncestors('$playVideo');
    }
  }

  _handleSubtitles() {
    this.fireAncestors('$showSubtitles');
  }

  _handleBack(e) {
    e.preventDefault();
    this.fireAncestors('$exitVideo', e);
  }

  _focus() {
    this._Icon.patch({
      color: Colors(colors.focus).alpha(1).get(),
    });
  }

  _unfocus() {
    this._Icon.patch({
      color: Colors(colors.unfocus).alpha(0.3).get(),
    });
  }
}
