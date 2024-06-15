import { Router } from '@lightningjs/sdk';
import { getMovieGenres, getMovies } from '../../../api/movies';
import { getSeries, getSeriesGenres } from '../../../api/series';
import { getEvents, getSports } from '../../../api/sports';
import { VOD_PREVIEW_TYPES, VOD_TYPES, constructCategoryItems, constructRails } from '../../utils';

const movies = {
  items: [],
  timestamp: 0,
};

const genres = {
  items: [],
  type: '',
  timestamp: 0,
};

const series = {
  items: [],
  timestamp: 0,
};

const sports = {
  items: [],
  timestamp: 0,
};

const sportsEvents = {
  items: [],
  timestamp: 0,
};

const fetchGenres = async (page, vodType) => {
  if (genres.timestamp + 1000 * 60 * 30 <= new Date().getTime() || genres.type !== vodType) {
    page._Categories._CaterogyItems.props = {
      items: [],
    };

    const fetcher = vodType === 'movies' ? getMovieGenres : getSeriesGenres;
    const {
      data: { entry },
    } = await fetcher();

    genres.items = constructCategoryItems(entry, vodType);

    genres.timestamp = new Date().getTime();
    genres.type = vodType;
  }

  page._Categories._CaterogyItems.props = {
    items: genres.items,
    yPos: 0,
  };
};

const fetchMovies = async (page) => {
  page._Categories.patch({
    visible: true,
  });
  page._LiveEvents.patch({
    visible: false,
  });

  if (movies.timestamp + 1000 * 60 * 30 <= new Date().getTime()) {
    page._Column.props = {
      items: [],
    };

    // trebalo bi da se napravi neki servis kao sto imamo za home da se fetchuje sa paginacijom
    const newMovies1 = await getMovies(1, 6);
    const newMovies2 = await getMovies(2, 6);
    const newMovies3 = await getMovies(3, 6);
    movies.items = constructRails([newMovies1, newMovies2, newMovies3], {
      railItemType: VOD_TYPES.MOVIE,
    });

    movies.timestamp = new Date().getTime();
  }

  page._Column.props = {
    items: movies.items,
  };
  page.props = {
    focusedState: 'Content',
  };
};

const fetchSeries = async (page) => {
  page._Categories.patch({
    visible: true,
  });
  page._LiveEvents.patch({
    visible: false,
  });

  sports.timestamp = 0;
  if (series.timestamp + 1000 * 60 * 30 <= new Date().getTime()) {
    page._Column.props = {
      items: [],
    };

    const series1 = await getSeries(1, 6);
    const series2 = await getSeries(2, 6);
    const series3 = await getSeries(3, 6);

    series.items = constructRails([series1, series2, series3], { railItemType: VOD_TYPES.SERIES });
    series.timestamp = new Date().getTime();
  }

  page._Column.props = {
    items: series.items,
  };

  page.props = {
    focusedState: 'Content',
  };
};

const fetchSports = async (page) => {
  page._Categories.patch({
    visible: false,
  });
  page._LiveEvents.patch({
    visible: true,
  });

  series.timestamp = 0;

  if (sports.timestamp + 1000 * 60 * 30 <= new Date().getTime()) {
    page._VodContainer.patch({});
    page._Column.props = {
      items: [],
    };

    const sports1 = await getSports(1, 7);
    const sports2 = await getSports(2, 7);
    const sports3 = await getSports(3, 7);

    sports.items = constructRails([sports1, sports2, sports3]);
    sports.timestamp = new Date().getTime();
  }

  page._Column.props = {
    items: sports.items,
  };
  page.props = {
    focusedState: 'Events',
  };
};

const fetchSportsEvents = async (page) => {
  page._Categories.patch({
    visible: false,
  });
  page._LiveEvents.patch({
    visible: true,
  });

  if (sportsEvents.timestamp + 1000 * 60 * 30 <= new Date().getTime()) {
    page._LiveEvents.patch({});
    page._LiveEvents.props = {
      items: [],
    };

    const event1 = await getEvents();

    sportsEvents.items = constructRails(event1);
    sportsEvents.timestamp = new Date().getTime();
  }

  sportsEvents.timestamp = new Date().getTime();

  // Check if sportsEvents.items exist and log appropriate message
  if (sportsEvents.items && sportsEvents.items.length > 0) {
    page._LiveEvents.props = {
      items: sportsEvents.items,
    };
  } else {
    page._LiveEvents.props = {
      items: [],
    };
  }
};

export default async function (page, { vodType }) {
  switch (vodType) {
    case VOD_PREVIEW_TYPES.MOVIES: {
      await fetchGenres(page, vodType);
      await fetchMovies(page);
      break;
    }
    case VOD_PREVIEW_TYPES.SERIES: {
      await fetchGenres(page, vodType);
      await fetchSeries(page);
      break;
    }
    case VOD_PREVIEW_TYPES.SPORTS: {
      await fetchSportsEvents(page);
      await fetchSports(page);
      break;
    }
    default:
      Router.back();
  }
}
