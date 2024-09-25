import { CMPService } from '../../../Services/CMPService';
import { DetailService } from '../../../Services/DetailService';

export default async function (page, { movieId }) {
  const movie = await DetailService.getMovie(movieId);

  let movieTrailerId = '';
  let movieTrailerUrl = '';

  if (movie.trailer) {
    const movieTrailer = await fetch(
      `https://api-applicaster.wedo.tv/getMovie?id=${movie.trailer.trim()}`
    );
    const res = await movieTrailer.json();

    movieTrailerId = res.entry[0].id;

    movieTrailerUrl = res.entry[0].content.src;
  }

  page.props = { movie, movieId, movieTrailerId, movieTrailerUrl };
}
