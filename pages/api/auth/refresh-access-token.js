import getConfig from 'next/config';
import { fetchHelper } from '../../../helpers/fetch';

const { serverRuntimeConfig } = getConfig();

async function handler(req, res) {
    try {
        const url = `${serverRuntimeConfig.dataesrApiUrl}/auth/refresh-access-token`;
        const tokens = req.cookies.tokens
            ? JSON.parse(req.cookies.tokens)
            : null;
        const requestOptions = fetchHelper.requestOptions('POST', {
            refreshToken: tokens.refreshToken,
        });

        const request = await fetch(url, requestOptions);

        const response = await request.text();

        const newTokens = JSON.parse(response);

        fetchHelper.setCookieTokens(res, newTokens);

        res.status(request.status).json(response);
    } catch (err) {
        res.status(500).send(err);
    }
}

export default handler;
