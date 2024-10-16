import { DetailService } from '../../../Services/DetailService';
import { CMPService } from '../../../Services/CMPService';
import { constructRails } from '../../utils';

export default async function (page, { seriesId }) {
  const { galleryItem, seasons } = await DetailService.getSerie(seriesId);

  let favorited = false;

  if (localStorage.getItem('userData')) {
    const response = await CMPService.getFavorites();

    favorited = response.data.favorites.some((element) => element.id === seriesId);
  }
  let firstEpisodeId = seasons ? +seasons[0].items[0].id : undefined;

  page.props = {
    sectionTitle: seasons[0]?.sectionTitle,
    galleryItem: galleryItem,
    favorited,
    duration: seasons.duration,
    // firstEpisodeVideoId: +seasons[0].items[0].id,
    firstEpisodeVideoId: seasons ? firstEpisodeId : undefined,
  };

  page._Column.props = {
    items: constructRails(seasons),
  };
}
