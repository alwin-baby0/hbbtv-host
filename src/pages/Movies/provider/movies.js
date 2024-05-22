import { getGenres } from '../../../api/movies';
import CategoryPickerItem from '../../../components/CategoryPickerItem/CategoryPickerItem';

const fetchGenres = (page) => {
  return getGenres('movies', 'genre_movies').then(({ data }) => {
    page._Categories.props = {
      x: 110,
      y: 150,
      width: 1700,
      height: 64,
    };

    const items = data.entry.map((item) => {
      return {
        type: CategoryPickerItem,
        w: 171,
        props: {
          itemInfo: item,
          w: 170,
          h: 64,
          radius: 30,
          strokeWidth: 6,
        },
      };
    });
    page._CaterogyItem.items = items;
  });
};

export default async function (page) {
  await fetchGenres(page);
}
