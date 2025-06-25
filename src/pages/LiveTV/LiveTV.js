import { Colors, Lightning, Router, VideoPlayer } from '@lightningjs/sdk';
import LiveTVPreview from '../../components/LiveTVPreview/LiveTVPreview';
import { EPGService } from '../../Services';
import VerticalContainer from '../../components/VerticalContainer/VerticalContainer';
import LiveChannelRailItem from '../../components/RailItems/LiveChannelRailItem';
import { constructRails } from '../utils';
import HorizontalContainer from '../../components/HorizontalContainer/HorizontalContainer';
import CategoryPicker from '../../components/CategoryPicker/CategoryPicker';
import EPGTimeSlot from './components/EPGTimeSlot';
import EPGContainer from '../../components/EPGContainer/EPGContainer';
import { clamp } from '../../utils';
import { eventTrackPayload } from '../../utils/device';
import colors from '../../../reskin/colors.json';
export default class LiveTV extends Lightning.Component {
  _props = {
    lastId: 0,
  };
  pixelPerHour = 500; // Pixels per hour for EPG time slots
  static _template() {
    return {
      Wrapper: {
        h: 1080,
        w: 1920,
        Column: {
          type: LiveTVPreview,
          w: 1700,
          h: 415,
        },
        Categories: {
          type: CategoryPicker,
          props: {
            x: 110,
            y: 540,
          },
        },
        Channels: {
          clipping: true,
          y: 705,
          w: 180,
          h: 360,
          x: 110,
          type: VerticalContainer,
        },
        EPGChannels: {
          y: 625,
          x: 290,
          w: 1620,
          h: 460,
          clipping: true,

          TimeSlot: {
            h: 50,
            w: 1615,
            x: 10,
            type: HorizontalContainer,
            clipping: true,
            props: {
              w: 1615,
            },
          },
          EPGData: {
            clipping: true,
            y: 80,
            w: 1615,
            h: 360,
            x: 10,
            type: EPGContainer,
            props: {
              w: 1615,
            },
          },

          Flag: {
            flex: { direction: 'column', justifyContent: 'center', alignItems: 'center' },
            Now: {
              x: -40,
              w: 80,
              h: 35,
              rect: true,
              color: Colors(colors.focusEpg).get(),
              shader: {
                type: lng.shaders.RoundedRectangle,
                radius: 18,
              },
              flex: { direction: 'column', justifyContent: 'center', alignItems: 'center' },
              Text: {
                shader: {
                  type: lng.shaders.RoundedRectangle,
                  radius: 0,
                },
                w: 50,
                h: 22,
                text: {
                  text: 'NOW',
                  fontSize: 18,
                  fontFace: 'Montserrat-SemiBold',
                  lineHeight: 21,
                },
              },
            },
            NowLine: {
              x: -40,
              rect: true,
              color: Colors(colors.focusEpg).get(),
              h: 400,
              w: 5,
              zIndex: 100,
            },
          },

          ProgressScroll: {
            rect: true,
            color: Colors('#D9D9D9').alpha(0.2).get(),
            h: 5,
            w: 1615,
            x: 10,
            y: 50,
            Progress: {
              rect: true,
              color: Colors('#D9D9D9').get(),
              h: 5,
              w: 180,
            },
          },
        },
      },
    };
  }

  $updateChannelInfo(matchingEntry, channelInfo, channelImage) {
    channelImage = EPGService.filteredChannelsItems[this._EPGData._focusedIndex];

    if (channelImage === undefined) {
      this._EPGData._focusedIndex = 0;
    }

    channelImage = EPGService.filteredChannelsItems[this._EPGData._focusedIndex];

    this._Column.props = {
      ...matchingEntry,
      channelInfo: channelInfo,
      channelImage: EPGService.filteredChannelsItems[this._EPGData._focusedIndex],
    };
  }

  $slideTimeSlot(x) {
    this._TimeSlot._setScrollPosition(x);
    const percent = -x / (((EPGService.endTime - EPGService.startTime) / (1000 * 60)) * 8.33);
    this._EPGChannels.patch({
      Flag: {
        x: x + ((new Date().getTime() - EPGService.startTime) / (1000 * 60)) * 8.33 + 10,
      },
      ProgressScroll: {
        Progress: {
          x: clamp(percent * 1615, 0, 1435),
        },
      },
    });
  }

  createTimeArray = async (startTime, endTime) => {
    // Parse startTime and endTime
    let startDate = new Date(startTime);
    let endDate = new Date(endTime);

    // Calculate the start and end hours and minutes
    let startHour = startDate.getHours();
    let startMinutes = startDate.getMinutes();
    let endHour = endDate.getHours();
    let endMinutes = endDate.getMinutes();

    // Calculate the pixels for the initial remaining minutes
    const initialMinutesInPixels = (startMinutes / 60) * this.pixelPerHour;

    // Adjust startHour and endHour based on the given conditions
    if (startMinutes > 0 && startMinutes < 30) {
      startMinutes = 30;
    } else if (startMinutes >= 30) {
      startHour += 1;
      startMinutes = 0;
    } else {
      startMinutes = 0;
    }

    if (endMinutes > 0) {
      endHour += 1;
      endMinutes = 0;
    } else {
      endMinutes = 0;
    }

    // Handle the case where end time is on the next day
    let timeArray = [];
    let hour = startDate.getHours();

    while (true) {
      timeArray.push(`${hour}:00`);
      if (hour !== endHour || startDate.getDate() !== endDate.getDate()) {
        timeArray.push(`${hour}:30`);
      }

      hour++;
      startDate.setTime(startDate.getTime() + 60 * 60 * 1000);
      if (hour === 24) {
        hour = 0;
      }

      if (startDate.getTime() > endDate.getTime()) {
        break;
      }
    }

    // Add the next rounded hour if end time is not a rounded hour
    if (endMinutes !== 0) {
      timeArray.push(`${endHour + 1}:00`);
    }

    return {
      timeArray: timeArray,
      initialMinutesInPixels: initialMinutesInPixels,
      startHour: startDate.getHours(), // Correcting this line to use startDate again
      startMinutes: startDate.getMinutes(), // Correcting this line to use startDate again
    };
  };

  _firstEnable() {
    this.fireAncestors('$punchHoleTV');
    this.$updateChannel(EPGService.channelsItems[0]);
    this._setState('Categories');
  }

  $selectedEPG(id) {
    const { lastId } = this._props;
    // You can use the lastId as needed here
    this._props.lastId = id; // Save the lastId

    // Example of using lastId
    this._EPGData.Items.children[this._EPGData._focusedIndex].Items.children[0]._selectButton(
      id,
      lastId
    );
  }

  _active() {
    eventTrackPayload('browse_channels', 4);
    this.$updateChannel(EPGService.filteredChannelsItems[this._Channels._focusedIndex]);

    this.createTimeArray(EPGService.startTime, EPGService.endTime).then((result) => {
      const calculatedPixels = (result.startMinutes / 60) * this.pixelPerHour;
      const hourss = result.timeArray.map((hour, index) => {
        let marginLeft = 0;
        if (index === 0) {
          marginLeft = -calculatedPixels;
        }
        return {
          type: EPGTimeSlot,
          w: 250,
          h: 50,
          flexItem: { marginLeft: marginLeft },
          props: {
            startTime: hour,
            xPos: 483,
          },
        };
      });

      this._TimeSlot.props = {
        items: hourss,
      };

      this._EPGData.setInitialOffset();
    });
  }

  _disable() {
    VideoPlayer.clear();
  }

  _handleBack() {
    this.fireAncestors('$unpunchHole');
    return false;
  }

  $updateChannel(singleChannel) {
    this._LiveSectionPlayer._changeChannel(singleChannel);
  }

  async $updateChannels(val) {
    await EPGService.fetchCategoryType(val.itemInfo.id);
    const result = await this.createTimeArray(EPGService.startTime, EPGService.endTime);
    const calculatedPixels = (result.startMinutes / 60) * this.pixelPerHour;
    this._TimeSlot.props = {
      items: [],
    };
    const hourss = result.timeArray.map((hour, index) => {
      let marginLeft = 0;
      if (index === 0) {
        marginLeft = -calculatedPixels; // Adjust this value based on your layout needs
      }
      return {
        type: EPGTimeSlot,
        w: 250,
        h: 50,
        flexItem: { marginLeft: marginLeft },
        props: {
          startTime: hour,
          xPos: 483,
        },
      };
    });

    this._TimeSlot.props = {
      items: hourss,
    };

    const filteredChannels = await EPGService.getFilteredChannels();
    this._EPGData._clear();
    const channels = filteredChannels
      .map((channelInfo, index) => {
        if (!channelInfo) {
          console.warn(`No channelInfo for index ${index}`);
          return null;
        }

        const matchingEpg = EPGService.epgs.find((epgInfo) => epgInfo.channelId === channelInfo.id);

        const rails = constructRails(matchingEpg);
        this._EPGData._appendItems(rails);
        return {
          type: LiveChannelRailItem,
          channelInfo: channelInfo,
          channelEPG: matchingEpg || {}, // No need for || {}, as matchingEpg is already checked
          w: 190,
          h: 105,
          channelIndex: index,
          props: {
            icon: channelInfo.icon,
          },
        };
      })
      .filter((channel) => channel !== null);

    this._Channels.props = {
      items: channels,
    };

    this._EPGData.setInitialOffset();
  }

  get id() {
    return 'LiveTV';
  }

  get _Column() {
    return this.tag('Column');
  }
  get _Flag() {
    return this.tag('EPGChannels.Flag');
  }
  get ProgressBar() {
    return this.tag('EPGChannels.ProgressScroll.Progress');
  }

  get _Wrapper() {
    return this.tag('Wrapper');
  }

  get _Categories() {
    return this.tag('Categories');
  }

  get _EPGChannels() {
    return this.tag('EPGChannels');
  }

  get _EPGData() {
    return this.tag('EPGData');
  }

  get _Channels() {
    return this.tag('Channels');
  }

  get _TimeSlot() {
    return this.tag('TimeSlot');
  }

  get _LiveSectionPlayer() {
    return this.tag('Column.LiveSection.Player');
  }

  $updateVerticalState(nextState) {
    this._setState(nextState);
  }

  static _states() {
    return [
      class Channels extends this {
        _getFocused() {
          return this._Channels;
        }

        _handleRight() {
          this._setState('EPGS');
        }

        _handleUp() {
          this._setState('Categories');
        }

        async $verticalContainerIndexChange(index) {
          if (
            EPGService.hasMore &&
            !EPGService.isLoading &&
            EPGService.stripesFetched - 2 === index
          ) {
            const newStripes = await EPGService.fetchMoreEPGs();
            const rails = constructRails(newStripes);
            this._EPGData._appendItems(rails);
          }
        }
      },

      class Categories extends this {
        _getFocused() {
          return this._Categories;
        }

        _handleUp() {
          if (!Router.isNavigating()) {
            Router.focusWidget('menu');
          }
        }

        _handleDown() {
          this._setState('EPGS');
        }
      },

      class EPGS extends this {
        _getFocused() {
          return this._EPGData;
        }

        _handleUp() {
          this._setState('Categories');
        }

        async $verticalContainerIndexChange(index) {
          if (EPGService.hasMore && !EPGService.loading && EPGService.stripesFetched - 3 <= index) {
            const startAt = EPGService.stripesFetched;
            const newStripes = await EPGService.fetchMoreEPGs();
            const rails = constructRails(newStripes.results);

            this._EPGData._appendItems(rails);

            this._EPGData.setInitialOffset(startAt, newStripes.length);
          }

          this._Channels.Items.y = this._EPGData.Items.y;
          this._Channels._focusedIndex = index;
        }
      },
    ];
  }
}
