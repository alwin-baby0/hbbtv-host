import { VOD_PREVIEW_TYPES, constructRails } from '../../utils';
import { CONTENT_TYPE } from '../../../components/VodContentContainer/VodContentContainer';
import { VodService } from '../../../Services';

export default async function (page, { vodType }) {
  VodService.vodType = vodType;

  await VodService.initialFetch();

  const vodStripes = constructRails(VodService.vodStripes);

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
      items: constructRails(VodService.contentStripes),
    },
    vodType,
    fetchMoreStripes: (index) => VodService.fetchMoreStripes(index),
  };
}
