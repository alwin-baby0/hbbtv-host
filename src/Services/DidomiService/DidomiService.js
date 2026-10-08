class DidomiService {
  constructor() {
    this.isReady = false;
    this.listeners = [];
  }

  init() {
    return new Promise((resolve) => {
      const check = setInterval(() => {
        if (window.Didomi && window.Didomi.on) {
          clearInterval(check);
          this.isReady = true;

          // Listen for consent changes
          window.Didomi.on('consent.changed', () => {
            this.notifyListeners();
          });

          resolve();
        }
      }, 100);
    });
  }

  hasConsentForPurpose(purposeId) {
    if (!this.isReady) return false;
    return window.Didomi.getUserConsentStatusForPurpose(purposeId);
  }

  showPreferences() {
    if (this.isReady) {
      window.Didomi.preferences.show();
    }
  }

  onConsentChanged(callback) {
    this.listeners.push(callback);
  }

  notifyListeners() {
    this.listeners.forEach((cb) => cb());
  }
}

const didomiService = new DidomiService();

export { didomiService as DidomiService };
