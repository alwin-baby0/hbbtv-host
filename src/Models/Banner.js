class Banner {
  constructor(data) {
    const { creatives } = data;

    // Extracting URLs for ctv_ related images
    this.ctvPosters = {
      720: creatives.ctv_720p.banner,
      1080: creatives.ctv_1080p.banner,
      2160: creatives.ctv_2160p.banner,
    };
  }

  // Method to get a CTV poster by resolution
  getCtvPoster(resolution) {
    const resolutionKey = resolution.toString(); // Ensure the resolution is a string
    return this.ctvPosters[resolutionKey] ?? null;
  }
}

export { Banner };
