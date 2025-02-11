import { DetailService } from '../../../Services/DetailService';
import { CMPService } from '../../../Services/CMPService';
import { constructRails } from '../../utils';

export default async function (page, { seriesId }) {
  let galleryItemSingleEp;

  const hash = window.location.hash;
  const queryString = hash.split('?')[1];
  const pathname = Object.fromEntries(new URLSearchParams(queryString));

  if (pathname.isDeeplinkEpisode) {
    galleryItemSingleEp = await DetailService.getMovie(pathname.episodeId);
  }

  const { galleryItem, seasons } = await DetailService.getSerie(seriesId);

  let favorited = false;

  if (localStorage.getItem('userData')) {
    const response = await CMPService.getFavorites();

    favorited = response.data.favorites.some((element) => element.id === seriesId);
  }
  let firstEpisodeId = seasons ? +seasons[0].items[0].id : undefined;

  page.props = {
    sectionTitle: seasons[0]?.sectionTitle,
    galleryItem: pathname?.isDeeplinkEpisode ? galleryItemSingleEp : galleryItem,
    favorited,
    duration: seasons.duration,
    position: galleryItem.position,
    // firstEpisodeVideoId: +seasons[0].items[0].id,
    firstEpisodeVideoId: seasons ? firstEpisodeId : undefined,
    seriesId: galleryItem.id,
    isDeeplinkEpisode: pathname.isDeeplinkEpisode,
  };

  page._Column.props = {
    items: constructRails(seasons),
  };
}
