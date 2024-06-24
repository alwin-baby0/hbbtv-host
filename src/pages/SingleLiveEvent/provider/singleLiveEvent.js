import { getEvents, getSingleEvent } from '../../../api/sports';
import { RAIL_TYPES, constructRails } from '../../utils';

const fetchSingleEvent = async ({ eventId }) => {
  return await getSingleEvent(eventId);
};

const fetchEvents = async () => {
  return await getEvents();
};

export default async function (page, { eventId }) {
  const [event, events] = await Promise.all([fetchSingleEvent({ eventId }), fetchEvents()]);
  console.log('event', event)
  if (!event) {
    throw new Error('Event data not found');
  }

  let episodes = [];
  let sectionTitle = 'No Events Available';

  if (events && events.items) {
    const filteredEvents = events.items.filter((e) => e.id !== eventId);

    episodes = constructRails([{ ...events, items: filteredEvents }], {
      railItemType: RAIL_TYPES.SPORT_LIVE,
      posterType: 'SPORTS',
      railTitle: true,
      railOption: {
        height: 385,
      },
    });
    sectionTitle = events.sectionTitle;
  } else {
    console.warn('Events data not found or empty');
  }

  page.props = {
    sectionTitle: event.sectionTitle,
    galleryItem: event.items[0],
  };
  page._Column.props = {
    items: episodes,
  };
  page._setState('HeroSection');
}
