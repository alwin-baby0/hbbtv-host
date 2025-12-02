import { LOCAL_STORAGE_KEYS } from '../../../constants/globalConstants';
import { DetailService, UserService } from '../../../Services';

export default async function (page, { movieId, cmpShown }) {
  const movie = await DetailService.getMovie(movieId);

  let movieTrailerId = '';
  let movieTrailerUrl = '';
  let favorited = false;
  let last_position = 0;

  if (movie.trailer) {
    const movieTrailer = await fetch(
      `${process.env.APP_BASE_URL_2}/getMovie?id=${movie.trailer.trim()}`
    );
    const res = await movieTrailer.json();

    movieTrailerId = res.entry[0].id;

    movieTrailerUrl = res.entry[0].content.src;
  }

  if (localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA)) {
    const resFav = await UserService.getFavorites();
    const resProgress = await UserService.getProgress(movieId);

    last_position = resProgress?.data.progress[0]?.position;
    favorited = resFav?.data?.favorites?.some((element) => element.video_id === movieId);
  }

  page.props = {
    movie,
    movieId,
    movieTrailerId,
    movieTrailerUrl,
    cmpShown,
    favorited,
    last_position,
  };
}
