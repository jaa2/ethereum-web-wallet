import browser from 'webextension-polyfill';

export default class Config {
  cachedValues: Record<string, any> = {};

  async get(key: string, _default: any): Promise<any> {
    if (key in this.cachedValues) {
      return this.cachedValues[key];
    }
    return browser.storage.local.get(key)
      .then((vals) => {
        if (key in vals) {
          this.cachedValues[key] = vals[key];
          return vals[key];
        }
        return _default;
      })
      .catch(() => {
        Promise.resolve(_default);
      });
  }

  getImmediate(key: string, _default: any) {
    if (key in this.cachedValues) {
      return this.cachedValues[key];
    }
    return _default;
  }

  async set(key: string, val: any) {
    this.cachedValues[key] = val;
    return browser.storage.local.set({ [key]: val });
  }
}
