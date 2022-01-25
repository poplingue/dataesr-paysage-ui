import getConfig from 'next/config';
import { fetchHelper } from '../../../helpers/fetch';

const { serverRuntimeConfig } = getConfig();

async function handler(req, res) {
    try {
        const url = `${serverRuntimeConfig.dataesrApiUrl}/auth/signin`;
        const requestOptions = fetchHelper.requestOptions('POST', req.body);

        const request = await fetch(url, requestOptions);

        const response = await request.text();

        res.status(request.status).json(response);
    } catch (err) {
        console.log('==== ERR API ==== ', err);
        res.status(500).send(err);
    }
}

export default handler;
