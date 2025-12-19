import { LOCAL_STORAGE_KEYS, ROUTES } from '../../../constants/globalConstants';
import { parseVodPlaylists } from '../../../Models';
import { DetailService, UserService } from '../../../Services';
import { constructRails } from '../../utils';

export default async function (page, { seriesId, seasonId, episodeId, cmpShown }) {
  let galleryItemSingleEp;
  let galleryItemLastPlayedEp;
  let ssaiLastEp;
  let position = 0;
  let lastPlayedEpisodeNumber;
  let lastPlayedSeasonNumber;
  let lastPlayedEpisodeUrl;
  let lastPlayedEpisodeTitle;
  let lastPlayedSeriesId;
  let lastPlayedEpisodeDuration;

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

  const seasonNumber = seasonId
    ? seasons.indexOf(
        seasons.filter((season) => {
          if (season.seasonId === seasonId) return true;
        })[0]
      )
    : undefined;

  const episodeNumber =
    seasonNumber && episodeId
      ? seasons[seasonNumber].items.indexOf(
          seasons[seasonNumber].items.filter((episode) => {
            if (episode.id === episodeId) return true;
          })[0]
        )
      : undefined;

  let favorited = false;

  if (localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA)) {
    const resFav = await UserService.getFavorites();
    const resProgress = await UserService.getSeriesProgress(seriesId);
    position = resProgress.data?.progress?.position;
    lastPlayedEpisodeNumber = resProgress.data?.progress?.episode_id;
    lastPlayedSeasonNumber = resProgress.data?.progress?.season_id;
    lastPlayedEpisodeTitle = resProgress.data?.last_episode?.title || '';
    lastPlayedEpisodeUrl = resProgress.data?.last_episode?.files?.[0]?.url || galleryItem.url || '';
    lastPlayedSeriesId = resProgress.data?.progress?.video_id;
    lastPlayedEpisodeDuration = resProgress.data?.last_episode?.duration || 0;

    favorited = resFav?.data?.favorites?.some((element) => element.video_id === seriesId);
  }

  let ssai;

  if (galleryItemSingleEp) {
    ssai = galleryItemSingleEp.ssai || undefined;
  } else {
    ssai = seasons ? seasons[0].items[0].ssai : undefined;
  }

  let seriesVODS;
  if (galleryItem?.playlists) {
    const parsedVODS = galleryItem.playlists.map((playlist) => parseVodPlaylists(playlist));
    seriesVODS = constructRails(parsedVODS, ROUTES.VOD);
  }

  page.props = {
    sectionTitle: seasons[seasonId ? seasonId : 0]?.sectionTitle,
    galleryItem: pathname?.isDeeplinkEpisode ? galleryItemSingleEp : galleryItem,
    favorited,
    duration: seasons.duration,
    position: position,
    lastPlayedId: lastPlayedSeriesId,
    lastPlayedUrl: lastPlayedEpisodeUrl,
    lastPlayedTitle: lastPlayedEpisodeTitle || undefined,
    lastPlayedEpisodeNumber: lastPlayedEpisodeNumber,
    lastPlayedSeasonNumber: lastPlayedSeasonNumber,
    lastPlayedEpisodeDuration: lastPlayedEpisodeDuration,
    firstEpisodeVideoId: galleryItem.firstEpisodeId,
    firstEpisodeUrl: galleryItem.firstEpisodeUrl,
    firstEpisodeTitle: galleryItem.firstEpisodeTitle,
    firstEpisodeEpisodeNumber: galleryItem.firstEpisodeEpisodeNumber,
    firstEpisodeSeasonNumber: galleryItem.firstEpisodeSeasonNumber,
    seriesId: galleryItem.id,
    isDeeplinkEpisode: pathname.isDeeplinkEpisode,
    ssai: galleryItem.ssai,
    ssaiLastEp: ssaiLastEp,
    cmpShown,
    allSeasons: updatedSeasons,
    playlistVODS: seriesVODS,
    focusSeasonId: seasonNumber,
    focusEpisodeId: episodeNumber,
  };

  const seasonsRail = constructRails(seasonTabsParsed);

  page._SeasonsBar.props = {
    items: seasonsRail,
    parentState: 'SeasonBar',
    seasonIndex: seasonNumber,
  };

  page._Column.props = {
    items: [...constructRails(updatedSeasons[seasonId ? seasonNumber : 0]), ...seriesVODS],
    parentState: 'Items',
    seasonIndex: seasonNumber,
    episodeIndex: episodeNumber,
  };
}
