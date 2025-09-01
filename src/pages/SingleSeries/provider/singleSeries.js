import { DetailService, CMPService } from '../../../Services';
import { constructRails } from '../../utils';

export default async function (page, { seriesId }) {
  let galleryItemSingleEp;
  let galleryItemLastPlayedEp;
  let ssaiLastEp;

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

    favorited = response.data.favorites?.some((element) => element.id === seriesId);
  }
  let firstEpisodeId = seasons ? +seasons[0].items[0].id : undefined;
  let firstEpisodeUrl = seasons ? seasons[0].items[0].url : undefined;

  if (galleryItem?.lastPlayedId) {
    galleryItemLastPlayedEp = await DetailService.getMovie(galleryItem?.lastPlayedId);
    ssaiLastEp = galleryItemLastPlayedEp?.ssai;
  }

  let ssai;

  if (galleryItemSingleEp) {
    ssai = galleryItemSingleEp.ssai || undefined;
  } else {
    ssai = seasons ? seasons[0].items[0].ssai : undefined;
  }

  page.props = {
    sectionTitle: seasons[0]?.sectionTitle,
    galleryItem: pathname?.isDeeplinkEpisode ? galleryItemSingleEp : galleryItem,
    favorited,
    duration: seasons.duration,
    position: galleryItem.position,
    lastPlayedId: galleryItem.lastPlayedId,
    lastPlayedUrl: galleryItem.url,
    // firstEpisodeVideoId: +seasons[0].items[0].id,
    firstEpisodeVideoId: seasons ? firstEpisodeId : undefined,
    firstEpisodeUrl: firstEpisodeUrl,
    seriesId: galleryItem.id,
    isDeeplinkEpisode: pathname.isDeeplinkEpisode,
    ssai: galleryItem.ssai,
    ssaiLastEp: ssaiLastEp,
  };

  const updatedSeasons = seasons.map((season) => {
    season.items = season.items.map((episode) => {
      const index = episode.title.indexOf(' - S');
      episode.title = episode.title.substring(index + 3, episode.title.length);

      return episode;
    });

    return season;
  });

  page._Column.props = {
    items: constructRails(updatedSeasons),
  };
}
