import { deleteDB, openDB } from 'idb';
import { getVal } from '../helpers/constants';
import NotifService from './Notif.service';

const DBService = {
    async getDB() {
        return window.indexedDB.open(
            getVal('IDB_DATABASE_NAME'),
            getVal('IDB_DATABASE_VERSION')
        );
    },

    async asyncDeleteDB(dbName) {
        return NotifService.promise(
            deleteDB(dbName).catch((err) => {
                console.error('==== deleteDB ==== ', err);

                return Promise.reject('Service IndexDB en erreur');
            }),
            'IndexDB deleted'
        );
    },

    async getDBNames() {
        return await window.indexedDB.databases();
    },

    async asyncOpenDB(dbName, version, objectStoreNames, cb) {
        try {
            return await openDB(dbName, version, {
                upgrade(db, oldVersion, newVersion, transaction) {
                    NotifService.techInfo(
                        `IndexDB version ${db.version} upgraded`
                    );

                    if (objectStoreNames) {
                        objectStoreNames.map((name) => {
                            if (db.objectStoreNames.contains(name)) {
                                db.deleteObjectStore(name);
                            }

                            db.createObjectStore(name, {
                                keyPath: 'uid',
                                autoIncrement: true,
                            });
                        });

                        if (cb) {
                            cb(objectStoreNames);
                        }
                    }
                },
                blocked(e) {
                    // Called if there are older versions of the database open on the origin, so this version cannot open
                    // TODO manage with link in popup alert to reload manually
                    console.debug('==== blocked ==== ', e);
                    window.location.reload();
                },
                blocking(e) {
                    // Called if connection is blocking a future version of the database from opening.
                    // TODO manage with link in popup alert to reload manually
                    console.debug('==== blocking ==== ', e);
                    window.location.reload();
                },
                terminated(e) {
                    console.debug('==== terminated ==== ', e);
                },
            });
        } catch (err) {
            await this.asyncDeleteDB(getVal('IDB_DATABASE_NAME'));
        }
    },

    async init(objectStoreNames, cb) {
        const db = await this.asyncOpenDB(
            getVal('IDB_DATABASE_NAME'),
            getVal('IDB_DATABASE_VERSION'),
            objectStoreNames,
            cb
        );

        if (cb) {
            cb(db.objectStoreNames, db.version);
        }

        NotifService.techInfo(`IndexDB version ${db.version} connected`);
    },

    async set(objValue, objectStoreName) {
        // TODO async
        let DBOpenRequest = await this.getDB(),
            db;

        DBOpenRequest.onsuccess = (event) => {
            db = DBOpenRequest.result;

            // create a new transaction
            const txn = event.target.result.transaction(
                objectStoreName,
                'readwrite'
            );

            // get the object store
            const store = txn.objectStore(objectStoreName);

            // set the value
            let query = store.put({ ...objValue });

            query.onsuccess = function (event) {
                // TODO handle popup success
                // console.log(event);
                // event.target.result.close();
            };

            query.onerror = function (event) {
                // TODO handle popup error
                console.log(event.target.errorCode);
            };

            // close the database once the
            // transaction completes
            txn.oncomplete = function () {
                db.close();
            };
        };
    },

    async setList(list, objectStoreName) {
        const db = await this.asyncOpenDB(
            getVal('IDB_DATABASE_NAME'),
            getVal('IDB_DATABASE_VERSION')
        );
        const tx = db.transaction(objectStoreName, 'readwrite');

        for (let i = 0; i < list.length; i = i + 1) {
            await tx.store.put({ ...list[i] });
        }

        await tx.done;
    },

    async deleteList(uids, objectStoreName) {
        const db = await this.asyncOpenDB(
            getVal('IDB_DATABASE_NAME'),
            getVal('IDB_DATABASE_VERSION')
        );
        // TODO add check
        const tx = db.transaction(objectStoreName);

        if (tx) {
            for (let i = 0; i < uids.length; i = i + 1) {
                const uid = await db.getKey(objectStoreName, uids[i]);

                if (uid) {
                    await db.delete(objectStoreName, uid);
                }
            }
        }
    },

    async clear(objectStoreName) {
        const db = await this.asyncOpenDB(
            getVal('IDB_DATABASE_NAME'),
            getVal('IDB_DATABASE_VERSION')
        );

        const tx = db.transaction(objectStoreName, 'readwrite');
        await NotifService.promise(tx.store.clear(), 'Store cleared');
    },

    async delete(uid, objectStoreName) {
        // TODO async
        let DBOpenRequest = await this.getDB(),
            db;

        DBOpenRequest.onsuccess = (event) => {
            db = DBOpenRequest.result;

            // create a new transaction
            const txn = event.target.result.transaction(
                objectStoreName,
                'readwrite'
            );

            // get the object store
            const store = txn.objectStore(objectStoreName);
            store.delete(uid);
        };
    },

    async getAllObjects(objectStoreName, objectStoreChecked) {
        if (!objectStoreChecked) {
            return [];
        }

        const db = await NotifService.promise(
            this.asyncOpenDB(
                getVal('IDB_DATABASE_NAME'),
                getVal('IDB_DATABASE_VERSION')
            ),
            'IndexDB getAllObjects connection ok'
        );

        const store = db
            .transaction(objectStoreName)
            .objectStore(objectStoreName);

        return await store.getAll();
    },
};

export default DBService;
