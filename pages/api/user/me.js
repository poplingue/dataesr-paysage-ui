import getConfig from 'next/config';
import { fetchHelper } from '../../../helpers/fetch';

const { serverRuntimeConfig } = getConfig();

async function handler(req, res) {
    try {
        const url = `${serverRuntimeConfig.dataesrApiUrl}/me`;
        // const headers = fetchHelper.authHeader({ accessToken: req.body });
        const requestOptions = fetchHelper.requestOptions('GET', null, {
            accessToken: req.body,
        });

        const request = await fetch(url, requestOptions);

        const response = await request.text();
        res.status(request.status).json(response);
    } catch (err) {
        res.status(500).send(err);
    }
}

export default handler;
