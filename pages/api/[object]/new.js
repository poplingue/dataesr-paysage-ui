import getConfig from 'next/config';
import { getObjectTypeDetails } from '../../../config/utils';
import { fetchHelper } from '../../../helpers/fetch';

const { serverRuntimeConfig } = getConfig();

async function handler(req, res) {
    const tokens = fetchHelper.headerTokens(req);

    const { object } = req.query;
    const { dataesrApi } = getObjectTypeDetails('', object);

    try {
        const url = `${serverRuntimeConfig.dataesrApiUrl}/${dataesrApi}`;

        const requestOptions = fetchHelper.requestOptions(
            'POST',
            req.body,
            tokens
        );

        const request = await fetch(url, requestOptions);

        fetchHelper.checkAuthorized(tokens, request, res);

        const response = await request.text();

        res.status(request.status).json(response);
    } catch (err) {
        res.status(500).send(err);
    }
}

export default handler;
