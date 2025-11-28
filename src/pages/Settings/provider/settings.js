import { LOCAL_STORAGE_KEYS } from '../../../constants/globalConstants';
import { CMPService } from '../../../Services';
import { getDeviceInfo } from '../../../utils/device';

export default async function (page) {
  const languages = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS)
  ).supported_languages;

  await CMPService.initialFetch();
  const serialNumber = getDeviceInfo().serialNumber;

  page.props = {
    languagesData: languages,
    serialNumber,
  };
}
