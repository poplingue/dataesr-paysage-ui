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
        await NotifService.promise(deleteDB(dbName), 'IndexDB deleted');
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
                        let names = [];

                        objectStoreNames.map((name) => {
                            if (db.objectStoreNames.contains(name)) {
                                db.deleteObjectStore(name);
                            }

                            db.createObjectStore(name, {
                                keyPath: 'uid',
                                autoIncrement: true,
                            });
                        });

                        cb(names);
                    }
                },
                blocked() {
                    // Called if there are older versions of the database open on the origin, so this version cannot open
                    // TODO manage with link in popup alert to reload manually
                    window.location.reload();
                },
                blocking() {
                    // Called if connection is blocking a future version of the database from opening.
                    // TODO manage with link in popup alert to reload manually
                    window.location.reload();
                },
                terminated(e) {
                    console.debug('==== terminated ==== ', e);
                },
            });
        } catch (err) {
            console.log('==== err ==== ', err);
            await NotifService.promise(
                this.asyncDeleteDB(getVal('IDB_DATABASE_NAME')),
                err
            );
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

    async deleteList(keys, objectStoreName) {
        const db = await this.asyncOpenDB(
            getVal('IDB_DATABASE_NAME'),
            getVal('IDB_DATABASE_VERSION')
        );
        // TODO add check
        const tx = db.transaction(objectStoreName);

        if (tx) {
            for (let i = 0; i < keys.length; i = i + 1) {
                const uid = await db.getKey(objectStoreName, keys[i]);

                if (uid) {
                    await db.delete(objectStoreName, uid);
                }
            }
        }
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
        const db = await NotifService.promise(
            this.asyncOpenDB(
                getVal('IDB_DATABASE_NAME'),
                getVal('IDB_DATABASE_VERSION')
            ),
            'IndexDB getAllObjects connection ok'
        );

        if (objectStoreChecked && db) {
            const store = db
                .transaction(objectStoreName)
                .objectStore(objectStoreName);

            return await store.getAll();
        } else {
            return [];
        }
    },
};

export default DBService;
