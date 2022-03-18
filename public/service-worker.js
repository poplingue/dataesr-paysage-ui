self.addEventListener('install', () => {
    console.log('Hello world from the Service Worker 🤙');
});

self.addEventListener('message', async (event) => {
    const {
        target: { name },
        data,
    } = event;

    if (name === 'New_object') {
        const { object } = data;

        // initial body required per object
        const bodyObject = {
            person: { lastName: '' },
            price: { nameFr: '' },
            category: { usualNameFr: '' },
            officialDocument: {
                nature: 'Publication au JO',
                type: 'Loi',
                document: '',
                documentNumber: '',
                title: '',
                pageUrl: 'https://www.legifrance.gouv.fr/jorf/jo',
            },
            term: { usualNameFr: '' },
            legalCategory: { longNameFr: '' },
            structure: { [`${object}Status`]: 'active' },
            document: { title: '' },
        };

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyObject[object]),
        };

        // Request to API: Init new Object
        await fetch(`/api/${object}/new`, requestOptions).then(async (resp) => {
            const data = await resp.clone().json();

            // TODO check data
            // SW POST event: Init new Object
            self.postMessage(JSON.stringify({ status: resp.status, data }));
        });
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
