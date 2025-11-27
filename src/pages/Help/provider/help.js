import HelpButton from '../../../components/Buttons/HelpButton/HelpButton';
import { SettingsService } from '../../../Services';

function splitTextIntoChunks(text, chunkSize) {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}

export default async function (page) {
  const { data } = await SettingsService.getPages();

  const texts = (
    await Promise.all(data.entry.map((page) => SettingsService.getSinglePage(page.id)))
  ).map((text) => {
    const plainText = text.data.entry.content_plain;
    let decodedText = '';

    if (typeof plainText === 'string') {
      const strippedText = plainText.replace(/<[^>]+>/g, '');
      decodedText = new DOMParser().parseFromString(strippedText, 'text/html').documentElement
        .textContent;
    }

    decodedText = splitTextIntoChunks(decodedText, 1000);

    return decodedText;
  });

  const items = data.entry.map((pageInfo, index) => ({
    type: HelpButton,
    pageInfoData: pageInfo,
    w: 410,
    h: 100,
    pageIndex: index,
  }));

  page._Row.props = {
    items: items,
    enableScroll: false,
  };

  page.props = {
    texts: texts,
  };

  page.helpPages = data.entry;
}
