const DB_NAME = 'tradeJournal';
const DB_VERSION = 1;
export const STORE_NAMES = {
  trades: 'trades',
  tags: 'tags',
  templates: 'templates',
};

const createId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const openDatabase = () =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAMES.trades)) {
        db.createObjectStore(STORE_NAMES.trades, { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains(STORE_NAMES.tags)) {
        const store = db.createObjectStore(STORE_NAMES.tags, { keyPath: 'id' });
        store.createIndex('name', 'name', { unique: true });
      }

      if (!db.objectStoreNames.contains(STORE_NAMES.templates)) {
        db.createObjectStore(STORE_NAMES.templates, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const requestToPromise = (request) =>
  new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const withStore = async (storeName, mode, callback) => {
  const db = await openDatabase();
  const tx = db.transaction(storeName, mode);
  const store = tx.objectStore(storeName);

  const result = await callback(store);

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve(result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
};

export const getAll = async (storeName) =>
  withStore(storeName, 'readonly', (store) => requestToPromise(store.getAll()));

export const getById = async (storeName, id) =>
  withStore(storeName, 'readonly', (store) => requestToPromise(store.get(id)));

export const addItem = async (storeName, item) =>
  withStore(storeName, 'readwrite', (store) => requestToPromise(store.add(item)));

export const putItem = async (storeName, item) =>
  withStore(storeName, 'readwrite', (store) => requestToPromise(store.put(item)));

export const deleteItem = async (storeName, id) =>
  withStore(storeName, 'readwrite', (store) => requestToPromise(store.delete(id)));

export const findByIndex = async (storeName, indexName, value) =>
  withStore(storeName, 'readonly', (store) => {
    const index = store.index(indexName);
    return requestToPromise(index.get(value));
  });

export const createRecord = async (storeName, item) => {
  const record = { ...item, id: item.id || createId() };
  await addItem(storeName, record);
  return record;
};
