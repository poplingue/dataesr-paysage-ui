import cookie from 'cookie';
import { fetchHelper } from '../../../helpers/fetch';

async function handler(req, res) {
    try {
        const c = cookie.parse(req ? req.headers.cookie : '');

        // TODO Tidy options
        const request = await fetch(
            'https://api.paysage.staging.dataesr.ovh/me',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    ...fetchHelper.authHeader(JSON.parse(c.tokens)),
                },
            }
        );

        const response = await request.text();
        res.status(request.status).json(response);
    } catch (err) {
        res.status(500).send(err);
    }
}

export default handler;
