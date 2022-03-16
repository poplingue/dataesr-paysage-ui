import nc from 'next-connect';
import getConfig from 'next/config';
import { getObjectTypeDetails } from '../../../../../../config/utils';
import { fetchHelper } from '../../../../../../helpers/fetch';

const { serverRuntimeConfig } = getConfig();

const handler = nc()
    .get(async (req, res) => {
        const tokens = fetchHelper.headerTokens(req);
        const { id, subObject, object, subObjectId } = req.query;

        try {
            const url = `${serverRuntimeConfig.dataesrApiUrl}/${
                getObjectTypeDetails('', object).dataesrApi
            }/${id}/${subObject}/${subObjectId}`;

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
        // TODO merge patch & delete
        const tokens = fetchHelper.headerTokens(req);
        const { id, object, subObject, subObjectId } = req.query;

        try {
            const url = `${serverRuntimeConfig.dataesrApiUrl}/${
                getObjectTypeDetails('', object).dataesrApi
            }/${id}/${subObject}/${subObjectId}`;
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
    .put(async (req, res) => {
        // TODO merge patch & delete & put
        const tokens = fetchHelper.headerTokens(req);
        const { id, object, subObject, subObjectId } = req.query;

        try {
            const url = `${serverRuntimeConfig.dataesrApiUrl}/${
                getObjectTypeDetails('', object).dataesrApi
            }/${id}/${subObject}/${subObjectId}`;
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
    })
    .delete(async (req, res) => {
        const tokens = fetchHelper.headerTokens(req);
        const { id, object, subObject, subObjectId } = req.query;

        try {
            const url = `${serverRuntimeConfig.dataesrApiUrl}/${
                getObjectTypeDetails('', object).dataesrApi
            }/${id}/${subObject}/${subObjectId}`;

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
