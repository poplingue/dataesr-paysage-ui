import nc from 'next-connect';
import getConfig from 'next/config';
import { fetchHelper } from '../../../../../helpers/fetch';

const { serverRuntimeConfig } = getConfig();

const handler = nc()
    .get(async (req, res) => {
        const tokens = fetchHelper.headerTokens(req);

        try {
            const url = `${serverRuntimeConfig.dataesrApiUrl}/structures/${req.query.id}/${req.query.subObject}`;
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
    .patch(async (req, res) => {
        const tokens = fetchHelper.headerTokens(req);

        try {
            const url = `${serverRuntimeConfig.dataesrApiUrl}/structures/${req.query.id}/${req.query.subObject}/${req.query.subObjectId}`;
            const requestOptions = fetchHelper.requestOptions(
                'PATCH',
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
    })
    .delete(async (req, res) => {
        const tokens = fetchHelper.headerTokens(req);

        try {
            // TODO refacto
            const url = `${serverRuntimeConfig.dataesrApiUrl}/structures/${req.query.id}/${req.query.subObject}/${req.query.subObjectId}`;

            const requestOptions = fetchHelper.requestOptions(
                'DELETE',
                req.body || null,
                tokens
            );

            const request = await fetch(url, requestOptions);

            fetchHelper.checkAuthorized(tokens, request, res);

            const response = await request.json();

            res.status(request.status).send(response);
        } catch (err) {
            res.status(500).send(err);
        }
    });

export default handler;
