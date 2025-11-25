import { LOCAL_STORAGE_KEYS } from '../../../constants/globalConstants';
import { DetailService, UserService } from '../../../Services';
import { constructRails } from '../../utils';

export default async function (page, { seriesId, cmpShown }) {
  let galleryItemSingleEp;
  let galleryItemLastPlayedEp;
  let ssaiLastEp;

  const hash = window.location.hash;
  const queryString = hash.split('?')[1];
  const pathname = Object.fromEntries(new URLSearchParams(queryString));

  if (pathname.isDeeplinkEpisode) {
    galleryItemSingleEp = await DetailService.getMovie(pathname.episodeId);
  }

  const { galleryItem, seasons, seasonTabsParsed } = await DetailService.getSerie(seriesId);

  const updatedSeasons = seasons.map((season) => {
    return {
      ...season,
      items: season.items.map((episode) => {
        const index = episode.title.indexOf(' - S');
        episode.title = episode.title.substring(index + 3, episode.title.length);

        return episode;
      }),
    };
  });

  let favorited = false;

  if (localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA)) {
    /* const response = await UserService.getFavorites();

    favorited = response.data.favorites?.some((element) => element.id === seriesId); */

    favorited = false;
  }
  const firstEpisodeId = seasons ? +seasons[0].items[0].id : undefined;
  const firstEpisodeUrl = seasons ? seasons[0].items[0].url : undefined;
  const firstEpisodeTitle = seasons ? updatedSeasons[0].items[0].title : undefined;

  const lastPlayedEpisode = seasons
    ? updatedSeasons.map((season) => {
        const newSeason = season.items.filter(
          (episode) => episode.id === galleryItem.lastPlayedId
        )[0];

        return newSeason;
      })[0]
    : undefined;

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
    lastPlayedUrl: lastPlayedEpisode ? lastPlayedEpisode.url : galleryItem.url,
    lastPlayedTitle: lastPlayedEpisode ? lastPlayedEpisode.title : undefined,
    firstEpisodeVideoId: seasons ? firstEpisodeId : undefined,
    firstEpisodeUrl: firstEpisodeUrl,
    firstEpisodeTitle: firstEpisodeTitle,
    seriesId: galleryItem.id,
    isDeeplinkEpisode: pathname.isDeeplinkEpisode,
    ssai: galleryItem.ssai,
    ssaiLastEp: ssaiLastEp,
    cmpShown,
    allSeasons: updatedSeasons,
  };

  const seasonsRail = constructRails(seasonTabsParsed);

  page._SeasonsBar.props = {
    items: seasonsRail,
    parentState: 'SeasonBar',
  };

  page._Column.props = {
    items: constructRails(updatedSeasons[0]),
    parentState: 'Items',
  };
}
