import cookie from 'cookie';
import getConfig from 'next/config';
import { fetchHelper } from '../../../helpers/fetch';
import { tokenMissingError } from '../../../helpers/internalMessages';

const { serverRuntimeConfig } = getConfig();

async function handler(req, res) {
    try {
        const url = `${serverRuntimeConfig.dataesrApiUrl}/auth/renew-activation-code`;

        let cookiesHeader = '';
        let tokens = null;

        if (req && req.headers && req.headers.cookie) {
            cookiesHeader = cookie.parse(req.headers.cookie);
        }

        if (!cookiesHeader) {
            res.status(403).send(tokenMissingError);
        } else if (Object.keys(cookiesHeader).includes('tokens')) {
            tokens = JSON.parse(cookiesHeader.tokens);
        }

        // TODO Tidy options
        const request = await fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...fetchHelper.authHeader(tokens),
            },
        });
        const response = await request.text();
        res.status(request.status).json(response);
    } catch (err) {
        res.status(500).send(err);
    }
}

export default handler;
