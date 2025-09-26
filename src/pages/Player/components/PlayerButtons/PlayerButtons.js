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
      zIndex: 5,
      h: 100,
      w: 120,
      flex: { direction: 'row', justifyContent: 'center', alignItems: 'center' },
      Button: {
        flex: { direction: 'row', alignItems: 'center' },
        h: 90,
        Icon: {
          color: Colors(colors.unfocus).alpha(0.6).get(),
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
      texture: lng.Tools.getSvgTexture(Utils.asset(buttonInfo.icon), width, height),
    });
  }

  _active() {
    const { buttonInfo } = this._props;
    const width = buttonInfo.label === 'pause' ? 90 : 66;
    const height = buttonInfo.label === 'pause' ? 90 : 66;
    if (buttonInfo.label === 'pause') {
      this._Icon.patch({
        texture: lng.Tools.getSvgTexture(
          VideoPlayer.playing
            ? Utils.asset('/icons/player/commands/pause.svg')
            : Utils.asset('/icons/player/commands/play.svg'),
          width,
          height
        ),
      });
    }
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
    this.fireAncestors('$startStopVideo');
  }

  _handleBackward() {
    this.fireAncestors('$skippingTime', false);
    this.fireAncestors('$startStopVideo');
  }

  _handlePause(isStopped) {
    this._props.isStopped = !isStopped;
    const isPlaying = VideoPlayer.playing;

    if (isPlaying) {
      this.fireAncestors('$pauseVideo');
    } else {
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

  _handleBackFromPlayer() {
    this.fireAncestors('$exitVideoFromBackClick');
  }

  _focus() {
    this._Icon.patch({
      color: Colors(colors.focus).alpha(1).get(),
    });
  }

  _unfocus() {
    this._Icon.patch({
      color: Colors(colors.unfocus).alpha(0.6).get(),
    });
  }

  _handleHover() {
    const { buttonInfo } = this._props;
    (buttonInfo.label === 'backward' || buttonInfo.label === 'forward') &&
      this.parent.children[1]._unfocus();
    const state =
      buttonInfo.label === 'subtitles'
        ? 'SubtitlesButton'
        : buttonInfo.label === 'back'
        ? 'Back'
        : 'Controls';
    this.fireAncestors('$horizontalPosterIndexChange', this.parent.children.indexOf(this));
    this.fireAncestors('$setState', state);
    this._focus();
  }

  _handleUnhover() {
    const { buttonInfo } = this._props;
    this.fireAncestors('$setState', 'Controls');
    if (buttonInfo.label === 'backward' || buttonInfo.label === 'forward') {
      this.fireAncestors('$horizontalPosterIndexChange', 1);
      this.parent.children[1]._focus();
    }
    buttonInfo.label !== 'pause' && this._unfocus();
  }

  _handleClick() {
    const { buttonInfo, isStopped } = this._props;
    if (buttonInfo.label === 'back') {
      this._handleBackFromPlayer();
    } else {
      this._handleEnter();
    }
  }
}
