import { imageSizes } from '../../../Models/utils';
import { DetailService } from '../../../Services/DetailService';
import { VodService } from '../../../Services/VodSerivce';
import { VOD_PREVIEW_TYPES, constructRails } from '../../utils';

export default async function (page, { eventId }) {
  const galleryItem = await DetailService.getEvent(eventId);

  VodService.vodType = VOD_PREVIEW_TYPES.SPORTS;
  await VodService.initialFetch();

  const singleItemCoverBg = VodService.contentStripes.items.find((item) => item.id === eventId);
  const fallbackImage = singleItemCoverBg.getLandscapePoster(imageSizes.XL)?.src;

  console.log(fallbackImage);

  page.props = {
    galleryItem,
    fallbackImage,
  };

  page._Column.props = {
    items: constructRails(VodService.contentStripes),
  };

  page._setState('HeroSection');
}
