import getConfig from 'next/config';
import { fetchHelper } from '../../../helpers/fetch';
import { noTokensError } from '../../../helpers/internalMessages';

const { serverRuntimeConfig } = getConfig();

async function handler(req, res) {
    try {
        const url = `${serverRuntimeConfig.dataesrApiUrl}/me`;
        const tokens = req.cookies.tokens
            ? JSON.parse(req.cookies.tokens)
            : null;

        if (!tokens) {
            return res.status(200).send(noTokensError);
        }

        const requestOptions = fetchHelper.requestOptions('GET', null, {
            accessToken: tokens.accessToken,
        });

        const request = await fetch(url, requestOptions);

        const response = await request.text();

        res.status(request.status).json(response);
    } catch (err) {
        res.status(500).send(err);
    }
}

export default handler;
