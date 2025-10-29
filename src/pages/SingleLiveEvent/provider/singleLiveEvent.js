import { imageSizes } from '../../../constants/globalConstants';
import { VodService, DetailService } from '../../../Services';
import { VOD_PREVIEW_TYPES, constructRails } from '../../utils';

export default async function (page, { eventId }) {
  const galleryItem = await DetailService.getEvent(eventId);

  VodService.vodType = VOD_PREVIEW_TYPES.SPORTS;
  await VodService.initialFetch();

  const singleItemCoverBg = VodService.contentStripes.items.find((item) => item.id === eventId);
  const fallbackImage = singleItemCoverBg?.getLandscapePoster(imageSizes.S)?.src;

  page.props = {
    galleryItem,
    fallbackImage,
  };

  page._Column.props = {
    items: constructRails(VodService.contentStripes),
    parentState: 'Items',
  };

  page._setState('HeroSection');
}
