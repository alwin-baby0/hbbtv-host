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
  help: 7,
};

/* export function getRouteNavbarIndex(route) {
  if (!route) return 0;
  return ROUTES_INDEX[route.split('/')[0]] ?? 0;
} */
export function getRouteNavbarIndex(route) {
  if (route) {
    return ROUTES_INDEX[route] ?? 0;
  }
  return 0;
}
