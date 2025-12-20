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

  kset = async (key, value) => {
    return chrome.storage.local.set({ [key]: value });
  };

  kquery = async () => {};
}

export const storage = new KVStorage();
