import Dexie from 'dexie';

const DB_VERSION: number = 1;

interface PropertyRow {
  key: string,
  val: string,
}

const PropertyKeys = {
  serviceWorkerCacheApiDisable: 'service_worker.cache_api_disable',
};

class PropertyDatabase extends Dexie {
  public property!: Dexie.Table<PropertyRow, string>;

  public constructor() {
    super('PropertyDatabase');
    this.version(DB_VERSION)
        .stores({ property: '++key,val' });
  }
}

const db = new PropertyDatabase();

const putPropertyRow = (row: PropertyRow): Promise<void> => db
  .transaction('rw', db.property, async () => {
    await db.property.put(row);
  });

const getPropertyRow = (key: string): Promise<PropertyRow | null> => db
  .transaction('r', db.property, async () => {
    const results = await db.property.where({ key });
    const count: number = await results.count();
    return count === 1 ? results.first() : null;
  });

export {
  putPropertyRow,
  getPropertyRow,
  PropertyKeys,
};
