const ROUTES_INDEX = {
  home: 0,
  movies: 1,
  series: 2,
  sports: 3,
  live: 4,
  search: 5,
  settings: 6,
  help: 7,
};

export function getRouteNavbarIndex(route) {
  return ROUTES_INDEX[route];
}
