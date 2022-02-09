import getConfig from 'next/config';
import { fetchHelper } from '../../../helpers/fetch';

const { serverRuntimeConfig } = getConfig();

async function handler(req, res) {
    try {
        const url = `${serverRuntimeConfig.dataesrApiUrl}/auth/activate-account`;
        const body = {
            activationCode: parseInt(req.body.activationCode),
        };
        const tokens = req.cookies.tokens
            ? JSON.parse(req.cookies.tokens)
            : null;

        const requestOptions = fetchHelper.requestOptions('POST', body, tokens);

        const request = await fetch(url, requestOptions);

        const response = await request.text();
        res.status(request.status).json(response);
    } catch (err) {
        res.status(500).send(err);
    }
}

export default handler;
