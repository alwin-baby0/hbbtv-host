import { LanguageService } from '../../../Services';
import { CMPService } from '../../../Services';
import { getDeviceInfo } from '../../../utils/device';

export default async function (page) {
  const languages = await LanguageService.getLanguages();
  await CMPService.initialFetch();
  const serialNumber = getDeviceInfo().serialNumber;

  page.props = {
    languagesData: languages.data,
    serialNumber,
  };
}
