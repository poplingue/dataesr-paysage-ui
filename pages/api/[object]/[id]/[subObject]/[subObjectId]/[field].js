import nc from 'next-connect';
import getConfig from 'next/config';
import { getObjectTypeDetails } from '../../../../../../config/utils';
import { fetchHelper } from '../../../../../../helpers/fetch';

const { serverRuntimeConfig } = getConfig();

const handler = nc().delete(async (req, res) => {
    const tokens = fetchHelper.headerTokens(req);
    const { id, object, subObject, subObjectId, field } = req.query;
    const { dataesrApi } = getObjectTypeDetails('', object);

    try {
        const url = `${serverRuntimeConfig.dataesrApiUrl}/${dataesrApi}/${id}/${subObject}/${subObjectId}/${field}`;

        const requestOptions = fetchHelper.requestOptions(
            'DELETE',
            req.body || null,
            tokens
        );

        const request = await fetch(url, requestOptions);

        fetchHelper.checkAuthorized(tokens, request, res);

        res.status(request.status).send();
    } catch (err) {
        res.status(500).send(err);
    }
});

export default handler;
