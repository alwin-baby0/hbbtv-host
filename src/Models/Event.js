class Event {
  constructor(data) {
    const { id, extensions, media_group, title } = data;
    this.id = id;
    this.title = title;

    this.url = data.content.src;
    this.buttonLabel = extensions.button_text;
    this.description = extensions.description;
    this.episodeCount = `${extensions.date} - ${extensions.time} | ${extensions.venue}`;;

    this.landscapePoster = {};

    if (media_group) {
      media_group[0]?.media_item?.forEach((item) => {
        if (item.key.includes('stream_placeholder'))
          this.landscapePoster = item;
      });
    }
  }

  getLandscapePoster() {
    return this.landscapePoster;
  }
}

export { Event };
