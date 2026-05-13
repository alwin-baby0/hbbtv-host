import { LOCAL_STORAGE_KEYS, ROUTES } from '../../../constants/globalConstants';
import { parseVodPlaylists } from '../../../Models';
import { DetailService, UserService } from '../../../Services';
import { constructRails } from '../../utils';

export default async function (page, { seriesId, seasonId, episodeId, title, cmpShown }) {
  const episodeTitle = ''; //title was here

  if (episodeId) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.EPISODE_ID_DETAIL, episodeId);
  }

  let galleryItemSingleEp;
  let ssaiLastEp;
  let position = 0;
  let lastPlayedEpisodeNumber;
  let lastPlayedSeasonNumber;
  let lastPlayedEpisodeUrl;
  let lastPlayedEpisodeTitle;
  let lastPlayedSeriesId;
  let lastPlayedEpisodeDuration;

  let seasonTitle = '';
  let seasonNumberPlusOne = '';
  let seasonFirstEpUrl = null;
  let seasonFirstEpTitle = '';

  const hash = window.location.hash;
  const queryString = hash.split('?')[1];
  const pathname = Object.fromEntries(new URLSearchParams(queryString));

  if (pathname.isDeeplinkEpisode) {
    galleryItemSingleEp = await DetailService.getMovie(pathname.episodeId);
  }

  const { galleryItem, seasons, seasonTabsParsed } = await DetailService.getSerie(
    seriesId,
    seasonId,
    localStorage.getItem(LOCAL_STORAGE_KEYS.EPISODE_ID_DETAIL)
  );

  const seasonNumber = seasonId
    ? seasons.indexOf(
        seasons.filter((season) => {
          if (season.seasonId === seasonId) return true;
        })[0]
      )
    : undefined;

  if (seasonId && !localStorage.getItem(LOCAL_STORAGE_KEYS.EPISODE_ID_DETAIL)) {
    //if there is seasonId and not episodeId, it is type of season
    seasonNumberPlusOne = seasonNumber + 1;
    seasonTitle = galleryItem.title + ` - S${seasonNumberPlusOne}`;
    const seasonFirstEp = seasons.find((season) => season.seasonId === seasonId);
    seasonFirstEpUrl = seasonFirstEp?.items?.[0]?.epFromSeasonUrl;
    seasonFirstEpTitle = seasonFirstEp?.items?.[0]?.title;
  }

  const episodeNumber =
    seasonNumber && episodeId
      ? seasons[seasonNumber].items.indexOf(
          seasons[seasonNumber].items.filter((episode) => {
            if (episode.id === episodeId) return true;
          })[0]
        )
      : undefined;

  if (localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA)) {
    const resProgress = await UserService.getSeriesProgress(seriesId);
    position = resProgress.data?.progress?.position;
    lastPlayedEpisodeNumber = resProgress.data?.progress?.episode_id;
    lastPlayedSeasonNumber = resProgress.data?.progress?.season_id;
    lastPlayedEpisodeTitle = resProgress.data?.last_episode?.title || '';
    lastPlayedEpisodeUrl = resProgress.data?.last_episode?.files?.[0]?.url || galleryItem.url || '';
    lastPlayedSeriesId = resProgress.data?.progress?.video_id;
    lastPlayedEpisodeDuration = resProgress.data?.last_episode?.duration || 0;
  }

  let seriesVODS;
  if (galleryItem?.playlists) {
    const parsedVODS = galleryItem.playlists.map((playlist) => parseVodPlaylists(playlist));
    seriesVODS = constructRails(parsedVODS, ROUTES.VOD);
  }

  page.props = {
    sectionTitle: seasons[seasonId ? seasonId : 0]?.sectionTitle,
    galleryItem: pathname?.isDeeplinkEpisode ? galleryItemSingleEp : galleryItem,
    favorited: galleryItem.favorited,
    duration: seasons.duration,
    position: position,
    lastPlayedId: lastPlayedSeriesId,
    lastPlayedUrl: lastPlayedEpisodeUrl,
    lastPlayedTitle: lastPlayedEpisodeTitle || undefined,
    lastPlayedEpisodeNumber: lastPlayedEpisodeNumber,
    lastPlayedSeasonNumber: lastPlayedSeasonNumber,
    lastPlayedEpisodeDuration: lastPlayedEpisodeDuration,
    firstEpisodeVideoId: episodeId ?? galleryItem.firstEpisodeId,
    firstEpisodeUrl: galleryItem.videoUrl || seasonFirstEpUrl || galleryItem.firstEpisodeUrl,
    firstEpisodeTitle: galleryItem.title || seasonFirstEpTitle || galleryItem.firstEpisodeTitle,
    firstEpisodeEpisodeNumber: galleryItem.episodeNumber || galleryItem.firstEpisodeEpisodeNumber,
    firstEpisodeSeasonNumber: galleryItem.seasonNumber || galleryItem.firstEpisodeSeasonNumber,
    seriesId: galleryItem.id,
    isDeeplinkEpisode: pathname.isDeeplinkEpisode,
    ssai: galleryItem.ssai,
    ssaiLastEp: ssaiLastEp,
    cmpShown,
    allSeasons: seasons,
    playlistVODS: seriesVODS,
    focusSeasonId: seasonNumber,
    focusEpisodeId: episodeNumber,
    episodeTitle: episodeTitle,
    seasonNumber: seasonNumberPlusOne,
    seasonTitle,
  };

  const seasonsRail = constructRails(seasonTabsParsed);

  page._SeasonsBar.props = {
    items: seasonsRail,
    parentState: 'SeasonBar',
    seasonIndex: seasonNumber,
  };

  page._Column.props = {
    items: [...constructRails(seasons[seasonId ? seasonNumber : 0]), ...seriesVODS],
    parentState: 'Items',
    seasonIndex: seasonNumber,
    episodeIndex: episodeNumber,
  };
}
