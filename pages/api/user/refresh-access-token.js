import cookie from 'cookie';

async function handler(req, res) {
    try {
        const c = cookie.parse(req ? req.headers.cookie : '');

        // TODO Tidy options
        const request = await fetch(
            'https://api.paysage.staging.dataesr.ovh/auth/refresh-access-token',
            {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(req.body),
            }
        );

        const response = await request.text();
        res.status(request.status).json(response);
    } catch (err) {
        res.status(500).send(err);
    }
}

export default handler;
