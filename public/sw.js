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
    console.log('worker event message', event.data);

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event.data.accessToken),
        credentials: 'include',
    };

    const response = await fetch(`api/structures/create`, requestOptions).then(
        (resp) => {
            setTimeout(() => {
                console.log('==== RESP ==== ', resp);

                if (resp.status < 400 && resp.status >= 200) {
                    self.postMessage(JSON.stringify(resp));
                } else {
                    console.log('==== ERR ==== ');
                }
            }, 2000);
        }
    );
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
