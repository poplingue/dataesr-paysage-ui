const urlsToCache = ['/'];

self.addEventListener('install', (event) => {
    console.log('Hello world from the Service Worker 🤙');

    event.waitUntil(
        caches.open('PSG_CACHE').then(function (cache) {
            console.log('Opened cache');

            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            // Cache hit - return response
            if (response) {
                return response;
            }

            return fetch(event.request);
        })
    );
});

self.addEventListener('message', async (event) => {
    const {
        target: { name },
        data,
    } = event;

    if (name === 'New_object') {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ [`${data.object}Status`]: 'active' }),
        };

        // Request to API: Init new Object
        await fetch(`/api/${data.object}/new`, requestOptions).then(
            async (resp) => {
                const data = await resp.clone().json();
                // TODO check data
                // SW POST event: Init new Object
                self.postMessage(JSON.stringify({ status: resp.status, data }));
            }
        );
    }

    if (name === 'Get_object') {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };

        await fetch(`/api/${data.object}/${data.id}`, requestOptions).then(
            async (resp) => {
                const data = await resp.clone().json();
                self.postMessage(JSON.stringify({ status: resp.status, data }));
            }
        );
    }
});

self.addEventListener('push', (event) => {
    console.log('worker event push', event);
});

self.addEventListener('sync', (event) => {
    console.log('worker event sync', event);
});

self.addEventListener('messageerror', (error) => {
    console.log('worker message error', error);
});

self.addEventListener('rejectionhandled', (error) => {
    console.log('worker rejectionhandled error', error);
});

self.addEventListener('unhandledrejection', (error) => {
    console.log('worker unhandledrejection error', error);
});
