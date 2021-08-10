import { getVal } from '../helpers/constants';

const DBService = {
    async getDB() {
        return window.indexedDB.open(getVal('IDB_DATABASE_NAME'), getVal('IDB_DATABASE_VERSION'));
    },
    async init(objectStores, cb) {
        const DBOpenRequest = await this.getDB();
        DBOpenRequest.onupgradeneeded = (event) => {
            let names = [];
            objectStores.map((name) => {
                event.target.result.createObjectStore(name, { keyPath: 'uid', autoIncrement: true });
                names.push(name);
            });
            cb(names);
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
    async getAll(name, cb, objectStoreChecked) {
        let DBOpenRequest = await this.getDB(), db, resultData = [];

        DBOpenRequest.onsuccess = (event) => {
            db = DBOpenRequest.result;

            if (objectStoreChecked) {
                const txn = event.target.result.transaction(name, 'readonly');
                const objectStore = txn.objectStore(name);

                objectStore.openCursor().onsuccess = (event) => {
                    let cursor = event.target.result;
                    if (cursor) {
                        let contact = cursor.value;
                        resultData.push(contact);
                        cb(contact);
                        // continue next record
                        cursor.continue();
                    }
                };
                // close the database connection
                txn.oncomplete = function () {
                    db.close();
                };
            }
        };
        DBOpenRequest.onerror = (event) => {
            // TODO manage error popup
            console.error('==== ERR ==== ', event);
        };
        return resultData;
    }
};

export default DBService;
