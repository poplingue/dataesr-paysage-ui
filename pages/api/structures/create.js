import getConfig from 'next/config';
import { fetchHelper } from '../../../helpers/fetch';

const { serverRuntimeConfig } = getConfig();

async function handler(req, res) {
    try {
        const url = `${serverRuntimeConfig.dataesrApiUrl}/structures`;
        const headers = fetchHelper.authHeader({ accessToken: req.body });

        const request = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body: JSON.stringify({ status: 'active' }),
        });

        const response = await request.text();
        res.status(request.status).json(response);
    } catch (err) {
        res.status(500).send(err);
    }
}

export default handler;
