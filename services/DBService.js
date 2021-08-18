import { openDB } from 'idb';
import { getVal } from '../helpers/constants';
import NotifService from './NotifService';

const DBService = {
    async getDB() {
        return window.indexedDB.open(getVal('IDB_DATABASE_NAME'), getVal('IDB_DATABASE_VERSION'));
    },

    async asyncOpenDB(name, version) {
        return await openDB(name, version, {
            upgrade(db, oldVersion, newVersion, transaction) {
                console.debug('==== upgrade ==== ', db);
            },
            blocked(e) {
                console.debug('==== blocked ==== ', e);
            },
            blocking(e) {
                console.debug('==== blocking ==== ', e);
            },
            terminated(e) {
                console.debug('==== terminated ==== ', e);
            },
        });
    },

    async init(objectStores, cb) {
        const DBOpenRequest = await this.getDB();

        DBOpenRequest.onupgradeneeded = (event) => {
            let names = [];

            objectStores.map((name) => {
                if (event.target.result.objectStoreNames.contains(name)) {
                    event.target.result.deleteObjectStore(name);
                }

                event.target.result.createObjectStore(name, { keyPath: 'uid', autoIncrement: true });
                names.push(name);
            });

            cb(names);
            NotifService.info(`IndexDB version upgraded from ${event.oldVersion} to ${event.newVersion}`);
        };

        DBOpenRequest.onsuccess = (event) => {
            if (cb) {
                cb(event.target.result.objectStoreNames);
            }
        };

        DBOpenRequest.onerror = (event) => {
            console.error('==== onerror ==== ', event);
        };
    },
    async set(val, name, objectStoreChecked) {
        let DBOpenRequest = await this.getDB(), db;

        DBOpenRequest.onsuccess = (event) => {
            db = DBOpenRequest.result;

            if (objectStoreChecked) {
                // create a new transaction
                const txn = event.target.result.transaction(name, 'readwrite');

                // get the object store
                const store = txn.objectStore(name);

                // set the value
                let query = store.put({ ...val });

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
            } else {
                console.log('==== New IndexDB version needed ==== ');
            }
        };
    },
    async delete(uid, name, objectStoreChecked) {
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
        // TODO refacto
        const db = await NotifService.fetching(this.asyncOpenDB(getVal('IDB_DATABASE_NAME'), getVal('IDB_DATABASE_VERSION')), 'IndexDB connection ok');

        if (objectStoreChecked && db) {
            const store = db.transaction(name).objectStore(name);

            return await store.getAll();
        } else {
            return [];
        }
    }
};

export default DBService;
