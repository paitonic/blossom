class KVStorage {
  constructor() {}

  kget = async (key, defaultValue) => {
    console.log(`kget(${key})`);
    const kv = await chrome.storage.local.get(key);
    if (Object.keys(kv).length > 0) {
      return Promise.resolve(kv[key]);
    } else {
      return Promise.resolve(defaultValue);
    }
  };

  kall = async () => {
    return chrome.storage.local.get(null);
  };

  kset = async (key, value) => {
    if (value === undefined) {
      // key is an object { key1: value1, key2: value2 }
      return chrome.storage.local.set(key);
    }
    return chrome.storage.local.set({ [key]: value });
  };

  kquery = async () => {};
}

export const storage = new KVStorage();
