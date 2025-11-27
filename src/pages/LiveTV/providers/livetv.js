import { EPGService } from '../../../Services';
import LiveChannelRailItem from '../../../components/RailItems/LiveChannelRailItem';
import { ROUTES } from '../../../constants/globalConstants';
import { constructRails } from '../../utils';
import { Router } from '@lightningjs/sdk';

export const liveTV = {
  timestamp: 0,
};

const fetchChannels = async (page) => {
  if (
    liveTV.timestamp + 1000 * 60 * 30 <= new Date().getTime() ||
    Router.getActiveHash() !== ROUTES.PLAYER
  ) {
    liveTV.timestamp = new Date().getTime();
    await EPGService.initialFetch();
    const categoryRails = constructRails(EPGService.genreItems);

    page._EPGData._clear();

    console.log(EPGService.channelsItems);
    const channelsAll = EPGService.channelsItems
      .map((channelInfo, index) => {
        if (!channelInfo) {
          console.warn(`No channelInfo for index ${index}`);
          return null;
        }

        console.log(channelInfo);
        const matchingEpg = EPGService.epgs.find((epgInfo) => {
          console.log(epgInfo);
          return Number(epgInfo.channelId) === channelInfo.id;
        });
        console.log(matchingEpg);
        const rails = constructRails(matchingEpg);
        console.log(rails);

        page._EPGData._appendItems(rails);
        return {
          type: LiveChannelRailItem,
          channelInfo: channelInfo,
          channelEPG: matchingEpg,
          w: 190,
          h: 105,
          channelIndex: index,
          props: {
            icon: channelInfo.icon,
          },
        };
      })
      .filter((channel) => channel !== null);
    console.log(channelsAll);

    page._Categories.props = {
      items: categoryRails,
      parentState: 'Categories',
    };

    page._Channels.props = {
      items: channelsAll,
      parentState: 'Channels',
    };
  }
};

export default async function (page) {
  await fetchChannels(page);
  page._EPGData.setInitialOffset();
}
