import { LOCAL_STORAGE_KEYS } from '../../../constants/globalConstants';
import { CMPService } from '../../../Services';
import { getDeviceInfo } from '../../../utils/device';

export default async function (page) {
  const languages = Object.fromEntries(
    Object.entries(
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS)).supported_languages
    ).slice(0, 4)
  );

  await CMPService.initialFetch();
  const serialNumber = getDeviceInfo().serialNumber;

  page.props = {
    languagesData: languages,
    serialNumber,
  };
}
