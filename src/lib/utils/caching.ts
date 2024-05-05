type CacheExpiresIn = "30s" | "1m" | "5m" | "10m" | "30m" | "1h";

const ClientCaching = <Type>(expiresIn?: CacheExpiresIn) => {
  const cache = new Map();

  let defaultExpiresIn = 30 * 1000;
  let timeout: number;

  switch (expiresIn) {
    case "30s":
      timeout = 30 * 1000;
      break;
    case "1m":
      timeout = 60 * 1000;
      break;
    case "5m":
      timeout = 5 * 60 * 1000;
      break;
    case "10m":
      timeout = 10 * 60 * 1000;
      break;
    case "30m":
      timeout = 30 * 60 * 1000;
      break;
    case "1h":
      timeout = 60 * 60 * 1000;
      break;
    default:
      timeout = defaultExpiresIn;
  }

  function get<T>(key: string, _default?: T) {
    const item = cache.get(key);
    if (item && item.expires > Date.now()) {
      return item.data as Type | T;
    }
    cache.delete(key);
    return _default;
  }

  function set(key: string, value: any): void {
    cache.set(key, {
      data: value,
      expires: Date.now() + timeout,
    });
  }

  function clear() {
    cache.clear();
  }

  function has(key: string) {
    return !!get(key);
  }

  return {
    get,
    set,
    has,
    clear,
    delete: (key: string) => cache.delete(key),
  };
};

export default ClientCaching;
