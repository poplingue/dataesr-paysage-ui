import getConfig from 'next/config';
import { fetchHelper } from '../../../helpers/fetch';

const { serverRuntimeConfig } = getConfig();

async function handler(req, res) {
    try {
        const url = `${serverRuntimeConfig.dataesrApiAuthUrl}/auth/renew-activation-code`;
        const tokens = fetchHelper.headerTokens(req);
        const requestOptions = fetchHelper.requestOptions('GET', null, tokens);

        const request = await fetch(url, requestOptions);

        const response = await request.text();
        res.status(request.status).json(response);
    } catch (err) {
        res.status(500).send(err);
    }
}

export default handler;
