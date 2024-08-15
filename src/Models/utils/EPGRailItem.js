class EPGRailItem {
  constructor(data) {
    const { id, title, type, summary, extensions, content } = data;
    this.id = id;
    this.title = title;
    this.type = type?.value;
    this.extensions = extensions;
    this.startTime = new Date(extensions.start_time).getTime();
    this.endTime = new Date(extensions.end_time).getTime();
    this.content = content;
    this.summary = summary;

    const startTime = extensions.start_time;
    const date = new Date(startTime);
    const hours = date.getHours(); // Local time hours
    const minutes = date.getMinutes(); // Local time minutes
    let totalMinutes = hours * 60 + minutes;

    this.startTimeInMS = totalMinutes;
  }

  getDuration = () => {
    return (this.endTime - this.startTime) / (1000 * 60);
  };
}

export { EPGRailItem };
