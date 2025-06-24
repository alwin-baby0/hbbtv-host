import { Colors, Lightning, Router, Utils, VideoPlayer } from '@lightningjs/sdk';
import lng from '@lightningjs/core';

export default class EPGRailItems extends Lightning.Component {
  _props = {
    isActive: false,
    lastClickedItemId: 0,
  };

  static _template() {
    return {
      collision: true,
      flexItem: { marginLeft: 0, marginRight: 0 },
      Wrapper: {
        h: 95,
        TitleText: {
          clipping: true,
          flex: { direction: 'column', justifyContent: 'center' },
          Text: {
            h: 22,
            text: '',
          },
          Time: {
            h: 20,
            text: {
              text: '',
              fontSize: 18,
            },
          },
        },
      },
    };
  }

  get _Wrapper() {
    return this.tag('Wrapper');
  }

  _selectButton(id, lastId) {
    this._props.lastClickedItemId = id;

    if (id === lastId) {
      VideoPlayer.close();
      this.fireAncestors('$unpunchHole');
      Router.navigate('player', {
        videoUrl: this._props.content.src,
        duration: 0,
        videoType: 'Stream now',
      });
    } else {
      this.fireAncestors('$updateChannel', this._props);
    }
  }

  set props(props) {
    this._props = { ...this._props, ...props };

    const currentTime = new Date();
    const startTime = new Date(props.extensions.start_time);
    const endTime = new Date(props.extensions.end_time);

    const formatTime = (date) => {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    };

    const formattedStartTime = formatTime(startTime);
    const formattedEndTime = formatTime(endTime);

    const durationInMinutes = endTime - startTime;

    const width = (durationInMinutes / 60000) * (500 / 60);

    this._epgWidth = width - 5;

    const fixedWidth = this._epgWidth > 200 ? this._epgWidth : this._epgWidth;
    const fixedWidth1 = this._epgWidth > 200 ? this._epgWidth - 20 : this._epgWidth - 50;

    this._Wrapper.patch({
      w: this._epgWidth,
      TitleText: {
        w: fixedWidth,
        Text: {
          flexItem: {
            marginTop: 20,
            marginLeft: this._epgWidth > 150 ? 25 : 0,
          },
          text: {
            text: this._props.title,
            wordWrapWidth: fixedWidth1,
            maxLines: 1,
            fontSize: 20,
            fontFace: 'Montserrat-SemiBold',
          },
        },
        Time: {
          flexItem: {
            marginTop: 5,
            marginLeft: this._epgWidth > 150 ? 25 : 0,
          },
          text: {
            text: `${formattedStartTime} - ${formattedEndTime}`,
            fontFace: 'Montserrat-Light',
          },
        }
      }
    });

    if (currentTime >= startTime && currentTime <= endTime) {
      this._props.isActive = true;
      this._Wrapper.patch({
        Icon: {
          x: 140,
          y: 49,
          w: 20,
          h: 20,
          texture: Lightning.Tools.getSvgTexture(
            Utils.asset('icons/livetv/play-button.svg'),
            20,
            20
          ),
        },
        texture: lng.Tools.getRoundRect(
          this._epgWidth,
          95,
          8,
          4,
          Colors('#353849').get(),
          true,
          Colors('#353849').get()
        ),
      });
    } else {
      this._props.isActive = false;
      this._Wrapper.patch({
        Icon: undefined,
        texture: lng.Tools.getRoundRect(
          this._epgWidth,
          95,
          8,
          4,
          Colors('#252835').get(),
          true,
          Colors('#252835').get()
        ),
      });
    }
  }

  _focus() {
    this._Wrapper.patch({
      texture: lng.Tools.getRoundRect(
        this._epgWidth,
        95,
        8,
        4,
        Colors('#A61619').get(),
        true,
        Colors('#A61619').get()
      ),
    });
  }

  _unfocus() {
    this._lastClickedItemId = null;
    this._props.isActive !== true
      ? this._Wrapper.patch({
        texture: lng.Tools.getRoundRect(
          this._epgWidth,
          95,
          8,
          4,
          Colors('#252835').get(),
          true,
          Colors('#252835').get()
        ),
      })
      : this._Wrapper.patch({
        texture: lng.Tools.getRoundRect(
          this._epgWidth,
          95,
          8,
          4,
          Colors('#353849').get(),
          true,
          Colors('#353849').get()
        ),
      });
  }

  _handleEnter() {
    const currentItemId = this._props.id; // Assume each item has a unique ID in props

    // Save the current ID as lastId before calling $selectedEPG
    const lastId = this._props.lastId || null; // Retrieve lastId if it exists, otherwise null
    if (this._props.isActive) {
      this.fireAncestors('$selectedEPG', currentItemId, lastId);
    }

    // Update the lastClickedItemId with the current one
    this._props.lastClickedItemId = currentItemId;
    this._props.lastId = currentItemId; // Save the current ID as the last ID
  }

  _handleHover() {
    const { index } = this._props;

    this.fireAncestors('$horizontalPosterIndexChange', index);
    this._focus();
  }

  _handleUnhover() {
    this._unfocus();
  }

  _handleClick() {
    this._handleEnter();
  }
}
