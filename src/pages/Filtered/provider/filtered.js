import { getSearch } from '../../../api/search';
import PosterRailItem from '../../../components/RailItems/PosterRailItem';
import MoviesRailItem from '../../../api/movies/MoviesRailItem';
import { Router } from '@lightningjs/sdk';
import HorizontalContainer from '../../../components/HorizontalContainer/HorizontalContainer';
import VerticalContainer from '../../../components/VerticalContainer/VerticalContainer';
import { Row } from '@lightningjs/ui-components';

const getGenresInfo = async (page, props) => {
  const ROW_SIZE = 6;

  // console.log('Genres:', props);
  // console.log('Category:', props);

  const category = props.action;
  const type = props.genre_movies;
  const { items: row } = await getSearch(category, type);

  const rows = [];
  if (row.length > 0) {
    for (let i = 0; i < row.length; i += ROW_SIZE) {
      rows.push({ items: row.slice(i, i + ROW_SIZE) });
    }

    const items = rows.map((row) => {
      return {
        type: HorizontalContainer,
        h: 500,
        w: 1760,
        itemSpacing: 520,
        props: {
          items: row.items.map((item) => ({
            type: PosterRailItem,
            flexItem: {
              marginLeft: 10,
              marginRight: 10,
              marginTop: 10,
              marginBottom: 10,
            },
            props: {
              itemTitle: item.title,
              imageSrc: item.getPortraitPoster(MoviesRailItem.small).src,
              callback: () => {
                Router.navigate(`movie-details/${item.id}`);
              },
            },
          })),
        },
      };
    });

    page._Title.text = '';
    page._Column.props = {
      items: items,
    };
  } else {
    page._Column.items = [];
    page._Title.text = 'NOTHING';
  }
};

export default async function (page, props) {
  await getGenresInfo(page, props);
}
