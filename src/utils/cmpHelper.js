// utils/cmpHelper.js
import { Router } from '@lightningjs/sdk';
import { CMPService } from '../Services';
import { ROUTES } from '../constants/globalConstants';

export async function checkCMP({ cmpShown, url, id }) {
  if (cmpShown) {
    return true;
  }

  await CMPService.initialFetch();
  const expireTs = CMPService.cmpData?.consent?.expire?.timestamp;
  const nowTs = Math.floor(Date.now() / 1000);

  if (!expireTs || expireTs === 0 || nowTs > expireTs) {
    const params = { url };

    if (id) {
      params.movieId = id;
    }
    Router.navigate(ROUTES.CMP, params, false);
    return false;
  }
  return true;
}
