const ROUTES_INDEX = {
  home: 0,
  'vod/movies': 1,
  'vod/series': 2,
  'vod/sports': 3,
  'filterPage/movie': 1,
  'filterPage/series': 2,
  live: 4,
  search: 5,
  account: 6,
  langsettings: 7,
  help: 8,
};

export function getRouteNavbarIndex(route, visibleSport) {
  const indexes = {
    ...ROUTES_INDEX,
    ...(!visibleSport && {
      live: 3,
      search: 4,
      account: 5,
      langsettings: 6,
      help: 7,
    }),
  };

  !visibleSport && delete indexes['vod/sports'];

  if (route) {
    return indexes[route] ?? 0;
  }
  return 0;
}
