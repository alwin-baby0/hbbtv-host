import { HomePageService } from '../../../Services/HomePageService';

export default async function (page) {
  if (page._props.sliderData !== null && page._props.railData) {
    return;
  }
  await HomePageService.initialFetch();

  // const modifiedRailData = [
  //   HomePageService.stripes[0], // Take the first element
  //   // [], // Insert an empty array
  //   HomePageService.banner,
  //   ...HomePageService.stripes.slice(1), // Append the rest of the railData elements
  // ];
  console.log('HomePageService.banner', HomePageService.banner);
  const modifiedRailData = [
    HomePageService.stripes[0], // Take the first element
    // [], // Insert an empty array
    ...(HomePageService.banner?.items ? [HomePageService.banner] : []), // Conditionally include banner if not empty
    ...HomePageService.stripes.slice(1), // Append the rest of the railData elements
  ];

  // console.log('modifued:', modifiedRailData);

  // console.log('PPPPPP:', HomePageService.banner);
  page.props = {
    sliderData: HomePageService.heroSectionItems,
    railData: modifiedRailData,
  };
}
