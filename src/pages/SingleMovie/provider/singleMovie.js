import { CMPService } from '../../../Services/CMPService';
import { DetailService } from '../../../Services/DetailService';

export default async function (page, { movieId }) {
  const movie = await DetailService.getMovie(movieId);

  let favorited = false;

  if (localStorage.getItem('userData')) {
    const response = await CMPService.getFavorites();

    favorited = response.data.favorites.some((element) => element.id === movieId);
  }

  page.props = { movie, favorited };
}
