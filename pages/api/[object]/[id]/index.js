import nc from 'next-connect';
import getConfig from 'next/config';
import { getObjectTypeDetails } from '../../../../config/utils';
import { fetchHelper } from '../../../../helpers/fetch';

const { serverRuntimeConfig } = getConfig();

const handler = nc()
    .get(async (req, res) => {
        const tokens = fetchHelper.headerTokens(req);
        const { object } = req.query;

        try {
            const url = `${serverRuntimeConfig.dataesrApiUrl}/${
                getObjectTypeDetails('', object).dataesrApi
            }/${req.query.id}`;
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
        const { object } = req.query;

        try {
            const url = `${serverRuntimeConfig.dataesrApiUrl}/${
                getObjectTypeDetails('', object).dataesrApi
            }/${req.query.id}/status`;
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
