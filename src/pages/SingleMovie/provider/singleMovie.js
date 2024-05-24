import { getSingleMovie } from '../../../api/movies';

const fetchSingleMovie = async (page, { movieId }) => {
  const movie = await getSingleMovie(movieId);

  page.props = {
    ...movie,
  };
};

export default async function (page, { movieId }) {
  await fetchSingleMovie(page, { movieId });
}
