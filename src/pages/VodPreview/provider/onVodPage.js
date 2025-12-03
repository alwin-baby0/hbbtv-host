import { constructRails } from '../../utils';
import { VOD_PREVIEW_TYPES, CONTENT_TYPE, ROUTES } from '../../../constants/globalConstants';
import { VodService } from '../../../Services';

export default async function (page, { vodType }) {
  VodService.vodType = vodType;

  await VodService.initialFetch();

  const stripes = VodService.vodStripes.map((stripe) => (stripe.value ? stripe.value : stripe));
  console.log(stripes);
  const vodStripes = constructRails(stripes, ROUTES.VOD);

  page.props = {
    items: Array.isArray(vodStripes)
      ? vodStripes.reduce((acc, rail) => {
          if (Array.isArray(rail)) {
            acc.push(...rail);
          } else {
            acc.push(rail);
          }
          return acc;
        }, [])
      : vodStripes,
    content: {
      contentType:
        vodType === VOD_PREVIEW_TYPES.SPORTS ? CONTENT_TYPE.EVENTS : CONTENT_TYPE.CATEGORIES,
      items:
        vodType !== VOD_PREVIEW_TYPES.SPORTS
          ? constructRails(VodService.contentStripes)
          : constructRails(VodService.contentStripes),
    },
    vodType,
    fetchMoreStripes: (index) => VodService.fetchMoreStripes(index),
    sliderData: VodService.heroSectionItems,
    fetchMoreHeroStripes: () => VodService.fetchMoreItemsForHeroSection(),
  };
}
