import { DetailService } from '../../../Services/DetailService';
import { constructRails } from '../../utils';

export default async function (page, { seriesId }) {
  const { galleryItem, seasons } = await DetailService.getSerie(seriesId);

  page.props = {
    sectionTitle: seasons[0]?.sectionTitle,
    galleryItem: galleryItem,
  };

  page._Column.props = {
    items: constructRails(seasons),
  };
}
