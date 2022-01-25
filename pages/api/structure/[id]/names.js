import cookie from 'cookie';
import nc from 'next-connect';
import getConfig from 'next/config';
import { fetchHelper } from '../../../../helpers/fetch';
import { tokenError } from '../../../../helpers/internalMessages';

const { serverRuntimeConfig } = getConfig();

const handler = nc()
    .get(async (req, res) => {
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
            const url = `${serverRuntimeConfig.dataesrApiUrl}/structures/${req.query.id}/names`;

            const request = await fetch(url, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    ...fetchHelper.authHeader(tokens),
                },
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
    })
    .patch(async (req, res) => {
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
            const url = `${serverRuntimeConfig.dataesrApiUrl}/structures/${req.query.id}/names/1`;
            const requestOptions = fetchHelper.requestOptions(
                'PATCH',
                req.body,
                tokens
            );

            const request = await fetch(url, requestOptions);

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
    });

export default handler;
