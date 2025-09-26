const ROUTES_INDEX = {
  home: 0,
  'vod/movies': 1,
  'vod/series': 2,
  'vod/sports': 3,
  'filterPage/movie': 1,
  'filterPage/series': 2,
  live: 4,
  search: 5,
  settings: 6,
  langsettings: 7,
  help: 8,
};

export function getRouteNavbarIndex(route) {
  if (route) {
    return ROUTES_INDEX[route] ?? 0;
  }
  return 0;
}
