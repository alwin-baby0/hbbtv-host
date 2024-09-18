import { CMPService } from '../../../Services/CMPService';
import { DetailService } from '../../../Services/DetailService';

export default async function (page, { movieId }) {
  const movie = await DetailService.getMovie(movieId);

  console.log(movie);

  page.props = { movie, movieId };
}
