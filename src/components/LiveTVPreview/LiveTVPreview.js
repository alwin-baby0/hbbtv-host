import { Colors, Lightning, Utils } from '@lightningjs/sdk';
import HorizontalContainer from '../HorizontalContainer/HorizontalContainer';
import LiveTVPlayer from '../../pages/LiveTV/components/LiveTVPlayer';
import ProgressBar from '../../pages/Player/components/ProgressBar/ProgressBar';
import colors from '../../../reskin/colors.json';
import { t } from '../../Services';
import { IMG_PATH, TRANSLATIONS } from '../../constants/globalConstants';

export default class LiveTVPreview extends Lightning.Component {
  _props = {};
  static _template() {
    return {
      LiveSection: {
        type: HorizontalContainer,
        x: 110,
        y: 105,
        w: 1700,
        h: 415,
        ChannelInfo: {
          w: 760,
          h: 295,
          flex: { direction: 'column' },
          ChannelName: {
            flex: { direction: 'row' },
            Icon: {
              w: 70,
              h: 35,
            },
            Name: {
              w: 670,
              h: 34,
              flexItem: {
                marginLeft: 20,
              },
              text: {
                text: 'TV MAX',
                fontSize: 28,
                fontFace: 'Montserrat-ExtraBold',
              },
            },
          },
          Title: {
            flexItem: {
              marginTop: 35,
            },
            w: 760,
            h: 50,
            text: {
              fontSize: 40,
              fontFace: 'Montserrat-Bold',
            },
          },
          ProgressBar: {
            flex: { direction: 'row', justifyContent: 'space-between' },
            StartTime: {
              w: 85,
              h: 35,
              flexItem: {
                marginTop: 35,
              },
              text: {
                text: '14:20',
                fontSize: 30,
                lineHeight: 35,
                fontFace: 'Montserrat-Bold',
              },
            },
            Progress: {
              flexItem: {
                marginTop: 50,
              },
              type: ProgressBar,
              w: 545,
              props: {
                width: 545,
                height: 10,
                progressColor: Colors(colors.white).get(),
              },
            },
            EndTime: {
              w: 85,
              h: 35,
              flexItem: {
                marginTop: 35,
              },
              text: {
                text: '14:47',
                fontSize: 30,
                lineHeight: 35,
                textAlign: 'center',
                fontFace: 'Montserrat-Bold',
              },
            },
          },
          ChannelDescription: {
            w: 760,
            h: 95,
            flexItem: {
              marginTop: 10,
            },
            text: {
              text: 'Horizontal layer scale vector ipsum undo bold italic arrange. Library vector vector auto distribute object content vertical selection. Asset outline layer create device inspect blur component. ',
              textColor: Colors('#BDBDBD').get(),
              fontSize: 20,
              lineHeight: 31,
              fontFace: 'Montserrat-Regular',
            },
          },
        },
        Player: {
          type: LiveTVPlayer,
          w: 745,
          h: 415,
          x: 200,
        },
      },
      PlayerError: {
        visible: false,
        x: 1067,
        y: 105,
        w: 747,
        h: 417,
        Image: {
          w: 745,
          h: 415,
          texture: lng.Tools.getSvgTexture(Utils.asset(IMG_PATH.LOADING_SCREEN), 890, 500),
        },
        Message: {
          text: {
            text: t(TRANSLATIONS.NO_STREAM),
            fontSize: 36,
            wordWrapWidth: 700,
            textAlign: 'center',
          },
        },
        shader: {
          type: Lightning.shaders.RoundedRectangle,
          radius: 20,
        },
      },
    };
  }

  _logTimeInHHMM(timeString) {
    const date = new Date(timeString);
    const localHours = String(date.getHours()).padStart(2, '0'); // Get local hours
    const localMinutes = String(date.getMinutes()).padStart(2, '0'); // Get local minutes
    return `${localHours}:${localMinutes}`;
  }

  parseTime(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    const now = new Date();
    now.setHours(hours, minutes, 0, 0); // Set hours and minutes while keeping the date the same
    return now;
  }

  calculateElapsedPercentage(startTimeStr, endTimeStr, currentTimeStr) {
    const startTime = this.parseTime(startTimeStr);
    const endTime = this.parseTime(endTimeStr);
    const currentTime = this.parseTime(currentTimeStr);

    const totalDuration = endTime - startTime;
    const elapsedDuration = currentTime - startTime;

    // Calculate the percentage of time elapsed
    const elapsedPercentage = (elapsedDuration / totalDuration) * 100;

    return elapsedPercentage;
  }

  convertPercentageToFraction(percentage) {
    return percentage / 100;
  }

  get _ChannelInfo() {
    return this.tag('LiveSection.ChannelInfo');
  }

  get _Progress() {
    return this.tag('LiveSection.ChannelInfo.ProgressBar.Progress');
  }

  get _Player() {
    return this.tag('Player');
  }

  set props(props) {
    this._props = { ...this._props, ...props };
    const { title, summary, extensions, channelImage } = this._props;

    const startTime = this._logTimeInHHMM(new Date(extensions.start_time));
    const endTime = this._logTimeInHHMM(new Date(extensions.end_time));

    const currentTime = this._logTimeInHHMM(new Date()); // Current local time
    const elapsedPercentage = this.calculateElapsedPercentage(startTime, endTime, currentTime);
    const progressPercentage = this.convertPercentageToFraction(elapsedPercentage);

    this._ChannelInfo.patch({
      ChannelName: {
        Icon: {
          src: channelImage.icon,
        },
        Name: {
          text: {
            text: channelImage?.title,
          },
        },
      },
      Title: {
        text: {
          text: title,
        },
      },
      ProgressBar: {
        StartTime: {
          text: {
            text: startTime,
          },
        },
        EndTime: {
          text: {
            text: endTime,
          },
        },
      },
      ChannelDescription: {
        text: {
          text: summary,
        },
      },
    });

    this._Progress.progress(progressPercentage);
  }

  _getFocused() {
    return this._Player;
  }
}
