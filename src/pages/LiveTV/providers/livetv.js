import { EPGService } from '../../../Services';
import LiveChannelRailItem from '../../../components/RailItems/LiveChannelRailItem';
import { constructRails } from '../../utils';
import { Router } from '@lightningjs/sdk';
const liveTV = {
  timestamp: 0,
};
const fetchChannels = async (page) => {
  if (
    liveTV.timestamp + 1000 * 60 * 30 <= new Date().getTime() ||
    Router.getActiveHash() !== 'player'
  ) {
    liveTV.timestamp = new Date().getTime();
    await EPGService.initialFetch();
    const categoryRails = constructRails(EPGService.genreItems);

    page.tag('EPGData')._clear();

    const channelsAll = EPGService.channelsItems
      .map((channelInfo, index) => {
        if (!channelInfo) {
          console.warn(`No channelInfo for index ${index}`);
          return null;
        }

        const matchingEpg = EPGService.epgs.find((epgInfo) => {
          return epgInfo.channelId === channelInfo.id;
        });
        const rails = constructRails(matchingEpg);

        page.tag('EPGData')._appendItems(rails);
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

    page.tag('Categories').props = {
      items: categoryRails,
    };

    page._Channels.props = {
      items: channelsAll,
    };
  }
};
export default async function (page) {
  await fetchChannels(page);
  page.tag('EPGData').setInitialOffset();
}
