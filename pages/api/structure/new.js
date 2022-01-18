import cookie from 'cookie';
import getConfig from 'next/config';
import { fetchHelper } from '../../../helpers/fetch';
import { tokenError } from '../../../helpers/internalMessages';

const { serverRuntimeConfig } = getConfig();

async function handler(req, res) {
    // TODO refacto cookieHeaders
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

    try {
        const url = `${serverRuntimeConfig.dataesrApiUrl}/structures`;

        const request = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...fetchHelper.authHeader(tokens),
            },
            body: JSON.stringify(req.body),
        });

        // TODO handle response in a service/helper
        if (
            tokens &&
            request.status === 401 &&
            request.statusText === 'Unauthorized'
        ) {
            res.status(401).send(tokenError);
        }

        const response = await request.text();
        res.status(request.status).json(response);
    } catch (err) {
        res.status(500).send(err);
    }
}

export default handler;
