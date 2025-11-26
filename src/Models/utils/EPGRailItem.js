class EPGRailItem {
  constructor(data) {
    const { id, title, meta, description, start_timestamp, end_timestamp, url } = data;
    const { type } = meta;
    this.id = id;
    this.title = title;
    this.type = type;
    this.startTimeAll = start_timestamp;
    this.endTimeAll = end_timestamp;
    this.startTime = new Date(start_timestamp.ms).getTime();
    this.endTime = new Date(end_timestamp.ms).getTime();
    this.src = url;
    this.summary = description;

    const startTime = start_timestamp.ms;
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
