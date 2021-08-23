import { deleteDB, openDB } from 'idb';
import { getVal } from '../helpers/constants';
import NotifService from './NotifService';

const DBService = {

    async getDB() {
        return window.indexedDB.open(getVal('IDB_DATABASE_NAME'), getVal('IDB_DATABASE_VERSION'));
    },

    async asyncDeleteDB(name) {
        await NotifService.promise(deleteDB(name), 'IndexDB deleted');
    },

    async getDBNames() {
        return await window.indexedDB.databases();
    },

    async asyncOpenDB(dbName, version, objectStores, cb) {

        return await openDB(dbName, version, {
            upgrade(db, oldVersion, newVersion, transaction) {
                NotifService.info(`IndexDB version ${db.version} upgraded`);

                if (objectStores) {
                    let names = [];

                    objectStores.map((name) => {
                        if (db.objectStoreNames.contains(name)) {
                            db.deleteObjectStore(name);
                        }

                        db.createObjectStore(name, { keyPath: 'uid', autoIncrement: true });
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
    },

    async init(objectStores, cb) {
        try {
            const db = await this.asyncOpenDB(getVal('IDB_DATABASE_NAME'), getVal('IDB_DATABASE_VERSION'), objectStores, cb);

            if (cb) {
                cb(db.objectStoreNames, db.version);
            }

            NotifService.info(`IndexDB version ${db.version} connected`);

        } catch (err) {
            console.log('==== err ==== ', err);
            await NotifService.promise(this.asyncDeleteDB(getVal('IDB_DATABASE_NAME')), err);
        }
    },

    async set(objValue, name) {
        // TODO async
        let DBOpenRequest = await this.getDB(), db;

        DBOpenRequest.onsuccess = (event) => {
            db = DBOpenRequest.result;

            // create a new transaction
            const txn = event.target.result.transaction(name, 'readwrite');

            // get the object store
            const store = txn.objectStore(name);

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

    async delete(uid, name, objectStoreChecked) {
        // TODO async
        let DBOpenRequest = await this.getDB(), db;

        DBOpenRequest.onsuccess = (event) => {

            db = DBOpenRequest.result;

            if (objectStoreChecked) {
                // create a new transaction
                const txn = event.target.result.transaction(name, 'readwrite');

                // get the object store
                const store = txn.objectStore(name);
                store.delete(uid);
            }
        };

    },

    async getAllObjects(name, objectStoreChecked) {
        const db = await NotifService.promise(this.asyncOpenDB(getVal('IDB_DATABASE_NAME'), getVal('IDB_DATABASE_VERSION')), 'IndexDB getAllObjects connection ok');

        if (objectStoreChecked && db) {
            const store = db.transaction(name).objectStore(name);

            return await store.getAll();
        } else {
            return [];
        }
    }
};

export default DBService;
