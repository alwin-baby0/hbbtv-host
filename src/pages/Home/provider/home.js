import { HomePageService } from '../../../Services';

async function checkImageVisibility(imageUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      resolve(true);
    };

    img.onerror = () => {
      resolve(false);
    };
  });
}

export default async function (page) {
  if (page._props.sliderData !== null && page._props.railData) {
    return;
  }
  await HomePageService.initialFetch();

  const isBannerImageExist = await checkImageVisibility(
    HomePageService.banner?.items[0].ctvPosters['1080']
  );
  const modifiedRailData = [
    HomePageService.stripes[0],
    ...(isBannerImageExist && HomePageService.banner?.items ? [HomePageService.banner] : []),
    ...HomePageService.stripes.slice(1),
  ];

  page.props = {
    sliderData: HomePageService.heroSectionItems,
    railData: modifiedRailData,
  };
}
