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
    if (event.target.name === 'New_object') {
        // TODO refacto requestOptions
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ [`${event.data.type}Status`]: 'active' }),
        };

        await fetch(`api/${event.data.type}/new`, requestOptions).then(
            async (resp) => {
                const data = await resp.clone().json();
                self.postMessage(JSON.stringify({ status: resp.status, data }));
            }
        );
    }

    if (event.target.name === 'Get_object') {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };

        await fetch(
            `api/${event.data.object}/${event.data.id}/names`,
            requestOptions
        ).then(async (resp) => {
            const { data } = await resp.clone().json();
            self.postMessage(JSON.stringify({ status: resp.status, data }));
        });
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
