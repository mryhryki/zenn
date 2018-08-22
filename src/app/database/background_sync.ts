import Dexie from 'dexie';

const DB_VERSION: number = 1;
const now = (): number => (new Date()).getTime();

interface BackgroundSyncRow {
  id?: number,
  path: string,
  body: string,
  result: string,
  createdAt?: number,
}

class BackgroundSyncDatabase extends Dexie {
  public backgroundSync!: Dexie.Table<BackgroundSyncRow, number>;

  public constructor() {
    super('BackgroundSyncDatabase');
    this.version(DB_VERSION)
        .stores({ backgroundSync: '++id,path,body,result,createdAt' });
  }
}

const db = new BackgroundSyncDatabase();

const addBackgroundSyncRow = (row: BackgroundSyncRow): Promise<number> => db
  .transaction('rw', db.backgroundSync, async () => {
    const createdAt: number = now();
    const _row: BackgroundSyncRow = { ...row, createdAt };
    return await db.backgroundSync.add(_row);
  });

const updateBackgroundSyncRow = (
  id: number,
  row: BackgroundSyncRow,
): Promise<void> => db
  .transaction('rw', db.backgroundSync, async () => {
    await db.backgroundSync.update(id, row);
  });

const getBackgroundSyncRow = (id: number): Promise<BackgroundSyncRow | null> => db
  .transaction('r', db.backgroundSync, async () => {
    const results = await db.backgroundSync.where({ id });
    const count: number = await results.count();
    return count === 1 ? results.first() : null;
  });

const getBackgroundSyncRows = (limit: number = 30): Promise<Array<BackgroundSyncRow>> => db
  .transaction('r', db.backgroundSync, async () => {
    return await db.backgroundSync
                   .orderBy('createdAt')
                   .reverse()
                   .limit(limit)
                   .toArray();
  });

export {
  addBackgroundSyncRow,
  getBackgroundSyncRow,
  getBackgroundSyncRows,
  updateBackgroundSyncRow,
};
