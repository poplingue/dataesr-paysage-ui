import nc from 'next-connect';
import getConfig from 'next/config';
import { getObjectTypeDetails } from '../../../../config/utils';
import { fetchHelper } from '../../../../helpers/fetch';

const { serverRuntimeConfig } = getConfig();

const handler = nc()
    .get(async (req, res) => {
        const tokens = fetchHelper.headerTokens(req);
        const { object, id } = req.query;
        const { dataesrApi } = getObjectTypeDetails('', object);

        try {
            const url = `${serverRuntimeConfig.dataesrApiUrl}/${dataesrApi}/${id}`;
            const requestOptions = fetchHelper.requestOptions(
                'GET',
                null,
                tokens
            );

            const request = await fetch(url, requestOptions);

            fetchHelper.checkAuthorized(tokens, request, res);

            const response = await request.text();

            res.status(request.status).json(response);
        } catch (err) {
            res.status(500).send(err);
        }
    })
    .put(async (req, res) => {
        const tokens = fetchHelper.headerTokens(req);
        const { object, id } = req.query;
        const { dataesrApi } = getObjectTypeDetails('', object);

        try {
            const url = `${serverRuntimeConfig.dataesrApiUrl}/${dataesrApi}/${id}/status`;
            const requestOptions = fetchHelper.requestOptions(
                'PUT',
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
    });

export default handler;
