import cookie from 'cookie';
import getConfig from 'next/config';
import { fetchHelper } from '../../../helpers/fetch';

const { serverRuntimeConfig } = getConfig();

async function handler(req, res) {
    try {
        const url = `${serverRuntimeConfig.authApiUrl}/auth/activate-account`;
        const body = {
            activationCode: parseInt(req.body.activationCode),
        };

        let cookiesHeader = '';
        let tokens = null;

        if (req && req.headers && req.headers.cookie) {
            cookiesHeader = cookie.parse(req.headers.cookie);
        }

        if (!cookiesHeader) {
            throw Error('Cookie missing');
        } else if (Object.keys(cookiesHeader).includes('tokens')) {
            tokens = JSON.parse(cookiesHeader.tokens);
        }

        // TODO Tidy options
        const request = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...fetchHelper.authHeader(tokens),
            },
            body: JSON.stringify(body),
        });

        const response = await request.text();
        res.status(request.status).json(response);
    } catch (err) {
        res.status(500).send(err);
    }
}

export default handler;
