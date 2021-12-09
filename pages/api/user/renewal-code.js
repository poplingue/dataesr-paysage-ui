import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

async function handler(req, res) {
    try {
        const url = `${serverRuntimeConfig.authApiUrl}/auth/send-password-renewal-code`;
        // TODO Tidy options
        const request = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body),
        });
        const response = await request.text();
        res.status(request.status).json(response);
    } catch (err) {
        res.status(500).send(err);
    }
}

export default handler;
