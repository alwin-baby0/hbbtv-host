import { getHomePage } from '../../../api/home';

export default async function (page) {
  const rows = Array.from({ length: 20 }, (_, index) => index + 1);
  const promises = rows.map((row) => getHomePage(row, 1, 6));
  Promise.all(promises).then((results) => {
    const resultsData = results.reduce((accumulator, data) => {
      return accumulator.concat(data);
    }, []);

    const allResults = resultsData;

    page.homePageData = allResults;
  });
}
