class KVStorage {
  constructor() {}

  kget = async (key, defaultValue) => {
    const kv = await chrome.storage.local.get(key);
    if (Object.keys(kv).length > 0) {
      return Promise.resolve(kv[key]);
    } else {
      return Promise.resolve(defaultValue);
    }
  };

  kbatch = async (keys) => {
    return chrome.storage.local.get(keys);
  };

  kall = () => {
    return chrome.storage.local.get(null);
  };

  kset = async (key, value) => {
    if (value === undefined) {
      // key is an object { key1: value1, key2: value2 }
      return chrome.storage.local.set($state.snapshot(key));
    }
    return chrome.storage.local.set($state.snapshot({ [key]: value }));
  };

  kdelete = async (key) => {
    return chrome.storage.local.remove(key);
  };

  kquery = async () => {};
}

export const storage = new KVStorage();
