import { IMAGE_SIZES, ROUTES, VOD_PREVIEW_TYPES } from '../../../constants/globalConstants';
import { parseVodPlaylists } from '../../../Models';
import { VodService, DetailService } from '../../../Services';
import { constructRails } from '../../utils';

export default async function (page, { eventId }) {
  const galleryItem = await DetailService.getEvent(eventId);

  let eventVODS;
  if (galleryItem?.playlists) {
    const parsedVODS = galleryItem.playlists.map((playlist) => parseVodPlaylists(playlist));
    eventVODS = constructRails(parsedVODS, ROUTES.VOD);
  }
  page.props = {
    galleryItem,
    fallbackImage: '',
  };

  page._Column.props = {
    items: eventVODS,
    parentState: 'Items',
  };

  page._setState('HeroSection');
}
