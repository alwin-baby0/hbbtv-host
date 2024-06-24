import { VOD_PREVIEW_TYPES, constructRails } from '../../utils';
import { CONTENT_TYPE } from '../../../Components/VodContentContainer/VodContentContainer';
import { VodService } from '../../../Services';

export default async function (page, { vodType }) {
  VodService.vodType = vodType;

  await VodService.initialFetch();

  page.props = {
    items: constructRails(VodService.vodStripes),
    content: {
      contentType: vodType === VOD_PREVIEW_TYPES.SPORTS ? CONTENT_TYPE.EVENTS : CONTENT_TYPE.CATEGORIES,
      items: constructRails(VodService.contentStripes),
    },
    vodType,
    fetchMoreStripes: (index) => VodService.fetchMoreStripes(index),
  };
}
