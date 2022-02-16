import getConfig from 'next/config';
import { fetchHelper } from '../../../helpers/fetch';
import { noTokensError } from '../../../helpers/internalMessages';

const { serverRuntimeConfig } = getConfig();

async function handler(req, res) {
    try {
        const url = `${serverRuntimeConfig.dataesrApiAuthUrl}/auth/signout`;
        const tokens = req.cookies.tokens
            ? JSON.parse(req.cookies.tokens)
            : null;

        if (!tokens) {
            return res.status(200).send(noTokensError);
        }

        const requestOptions = fetchHelper.requestOptions('POST', {}, tokens);

        const request = await fetch(url, requestOptions);

        const response = await request.json();

        if (response && response.message === 'Déconnecté') {
            fetchHelper.setCookieTokens(res, '', 0);
        }

        res.status(request.status).json(response);
    } catch (err) {
        res.status(500).send(err);
    }
}

export default handler;
