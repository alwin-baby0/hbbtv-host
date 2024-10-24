import { Colors, Lightning, Router } from '@lightningjs/sdk';
import LiveTVPreview from '../../components/LiveTVPreview/LiveTVPreview';
import { EPGService } from '../../Services/EPGService';
import VerticalContainer from '../../components/VerticalContainer/VerticalContainer';
import LiveChannelRailItem from '../../components/RailItems/LiveChannelRailItem';
import { constructRails } from '../utils';
import HorizontalContainer from '../../components/HorizontalContainer/HorizontalContainer';
import CategoryPicker from '../../Components/CategoryPicker/CategoryPicker';
import EPGTimeSlot from './components/EPGTimeSlot';
import EPGContainer from '../../components/EPGContainer/EPGContainer';
import { clamp } from '../../utils';
import { eventTrackPayload } from '../../utils/device';

export default class LiveTV extends Lightning.Component {
  _props = {
    lastId: 0,
  };
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
              color: Colors('#E01D21').get(),
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
                // w: 46,
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
              color: Colors('#E01D21').get(),
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
    channelImage = EPGService.filteredChannelsItems[this.tag('EPGData')._focusedIndex];

    if (channelImage === undefined) {
      this.tag('EPGData')._focusedIndex = 0;
    }

    channelImage = EPGService.filteredChannelsItems[this.tag('EPGData')._focusedIndex];

    this.tag('Column').props = {
      ...matchingEntry,
      channelInfo: channelInfo,
      channelImage: EPGService.filteredChannelsItems[this.tag('EPGData')._focusedIndex],
    };
  }

  $slideTimeSlot(x) {
    this.tag('TimeSlot')._setScrollPosition(x);
    this.tag('EPGChannels.Flag').patch({
      x: x + ((new Date().getTime() - EPGService.startTime) / (1000 * 60)) * 8.33 + 10,
    });

    const percent = -x / (((EPGService.endTime - EPGService.startTime) / (1000 * 60)) * 8.33);
    this.tag('EPGChannels.ProgressScroll.Progress').patch({
      x: clamp(percent * 1615, 0, 1435),
    });
  }

  createTimeArray(startTime, endTime) {
    // Parse startTime and endTime
    let startDate = new Date(startTime);
    let endDate = new Date(endTime);

    // Calculate the start and end hours and minutes
    let startHour = startDate.getHours();
    let startMinutes = startDate.getMinutes();
    let endHour = endDate.getHours();
    let endMinutes = endDate.getMinutes();

    // Calculate the pixels for the initial remaining minutes
    const pixelPerHour = 500;
    const initialMinutesInPixels = (startMinutes / 60) * pixelPerHour;

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
      if (hour === 24) {
        hour = 0;
      }

      if (hour === endHour && timeArray.includes(`${hour}:00`)) {
        break;
      }
    }

    // Add the next rounded hour if end time is not a rounded hour
    if (endMinutes !== 0) {
      timeArray.push(`${endHour + 1}:00`);
    }

    // Calculate the pixel values dynamically
    function calculatePixels(minutes) {
      return (minutes / 60) * pixelPerHour;
    }

    return {
      timeArray: timeArray,
      initialMinutesInPixels: initialMinutesInPixels,
      calculatePixels: calculatePixels,
      startHour: startDate.getHours(), // Correcting this line to use startDate again
      startMinutes: startDate.getMinutes(), // Correcting this line to use startDate again
    };
  }

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
    this._EPGChannels
      .tag('EPGData')
      .Items.children[this.tag('EPGData')._focusedIndex].Items.children[0]._selectButton(
        id,
        lastId
      );
  }

  async _active() {
    eventTrackPayload('browse_channels', 4);
    this.$updateChannel(EPGService.filteredChannelsItems[this._Channels._focusedIndex]);

    const result = this.createTimeArray(EPGService.startTime, EPGService.endTime);

    const calculatedPixels = result.calculatePixels(result.startMinutes);
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

    this.tag('TimeSlot').props = {
      items: hourss,
    };

    this.tag('EPGData').setInitialOffset();
  }

  $updateChannel(singleChannel) {
    this.tag('Column.LiveSection.Player')._changeChannel(singleChannel);
  }

  async $updateChannels(val) {
    await EPGService.fetchCategoryType(val.itemInfo.id);
    const result = this.createTimeArray(EPGService.startTime, EPGService.endTime);
    const calculatedPixels = result.calculatePixels(result.startMinutes);
    this.tag('TimeSlot').props = {
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

    this.tag('TimeSlot').props = {
      items: hourss,
    };

    let totalMinutes;
    const filteredChannels = await EPGService.getFilteredChannels();
    // Calculate the difference in milliseconds
    const timeDifference = EPGService.endTime - EPGService.startTime;
    const mainContainerWidth = Math.floor(timeDifference / (1000 * 60)) * 8.33;

    EPGService.epgs.forEach((epg) => {
      if (epg.items && epg.items.length > 0) {
        const startTime = epg.items[0].extensions.start_time;
        const date = new Date(startTime);
        const hours = date.getHours(); // Local time hours
        const minutes = date.getMinutes(); // Local time minutes
        totalMinutes = hours * 60 + minutes;
      } else {
        console.log('No items in epg');
      }
    });

    this.tag('EPGData')._clear();

    const channels = filteredChannels
      .map((channelInfo, index) => {
        if (!channelInfo) {
          console.warn(`No channelInfo for index ${index}`);
          return null;
        }

        const matchingEpg = EPGService.epgs.find((epgInfo) => epgInfo.channelId === channelInfo.id);

        const rails = constructRails(matchingEpg);
        this.tag('EPGData')._appendItems(rails);
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

    this.tag('EPGData').setInitialOffset();
  }

  get id() {
    return 'LiveTV';
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

  get _Channels() {
    return this.tag('Channels');
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
            this.tag('EPGData')._appendItems(rails);
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
          return this.tag('EPGData');
        }

        _handleUp() {
          this._setState('Categories');
        }

        async $verticalContainerIndexChange(index) {
          if (
            EPGService.hasMore &&
            !EPGService.loading &&
            EPGService.stripesFetched - 3 === index
          ) {
            const newStripes = await EPGService.fetchMoreEPGs();
            const rails = constructRails(newStripes.results);

            this.tag('EPGData')._appendItems(rails);

            this.tag('EPGData').setInitialOffset();
          }

          this._Channels.Items.y = this.tag('EPGData').Items.y;
          this._Channels._focusedIndex = index;
        }
      },
    ];
  }
}
