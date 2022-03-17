self.addEventListener('install', () => {
    console.log('Hello world from the Service Worker 🤙');
});

self.addEventListener('message', async (event) => {
    const {
        target: { name },
        data,
    } = event;

    if (name === 'New_object') {
        // TODO refacto
        let body = JSON.stringify({ [`${data.object}Status`]: 'active' });

        if (data.object === 'person') {
            body = JSON.stringify({ lastName: '' });
        }

        if (data.object === 'price') {
            body = JSON.stringify({ nameFr: '' });
        }

        if (data.object === 'category') {
            body = JSON.stringify({ usualNameFr: '' });
        }

        if (data.object === 'officialDocument') {
            body = JSON.stringify({
                nature: 'Publication au JO',
                type: 'Loi',
                document: '',
                documentNumber: '',
                title: '',
                pageUrl: 'https://www.legifrance.gouv.fr/jorf/jo',
            });
        }

        if (data.object === 'term') {
            body = JSON.stringify({ usualNameFr: '' });
        }

        if (data.object === 'legalCategory') {
            body = JSON.stringify({ longNameFr: '' });
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
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
                console.log('==== LOG ==== ', data);

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
