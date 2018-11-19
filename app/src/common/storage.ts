class SessionStorage {
  static get = (key: string): (string | null) => (sessionStorage.getItem(key));
  static set = (key: string, value: string): void => (sessionStorage.setItem(key, value));
  static remove = (key: string): void => (sessionStorage.removeItem(key));
};

class LocalStorage {
  static get = (key: string): (string | null) => (localStorage.getItem(key));
  static set = (key: string, value: string): void => (localStorage.setItem(key, value));
  static remove = (key: string): void => (localStorage.removeItem(key));
};

export {
  SessionStorage,
  LocalStorage,
};