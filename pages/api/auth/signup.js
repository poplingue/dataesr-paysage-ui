import getConfig from 'next/config';
import { fetchHelper } from '../../../helpers/fetch';

const { serverRuntimeConfig } = getConfig();

async function handler(req, res) {
    try {
        const url = `${serverRuntimeConfig.dataesrApiUrl}/auth/signup`;
        const requestOptions = fetchHelper.requestOptions('POST', req.body);

        const request = await fetch(url, requestOptions);

        const response = await request.text();

        const tokens = JSON.parse(response);

        if (tokens && tokens.accessToken && tokens.refreshToken) {
            fetchHelper.setCookieTokens(res, tokens);
        }

        res.status(request.status).json(response);
    } catch (err) {
        res.status(500).send(err);
    }
}

export default handler;
