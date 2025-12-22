class Banner {
  constructor(data) {
    const { type, images } = data;
    this.type = type;

    // Extracting URLs for ctv_ related images
    this.ctvPosters = { ...images.banner };
  }

  // Method to get a CTV poster by resolution
  getCtvPoster(resolution) {
    const resolutionKey = resolution.toString(); // Ensure the resolution is a string
    return this.ctvPosters[resolutionKey] ?? null;
  }
}

export { Banner };
