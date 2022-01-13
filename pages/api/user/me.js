import getConfig from 'next/config';
import nookies from 'nookies';
import { fetchHelper } from '../../../helpers/fetch';

const { serverRuntimeConfig } = getConfig();

async function handler({ ctx }) {
    try {
        const url = `${serverRuntimeConfig.dataesrApiUrl}/me`;
        const headers = fetchHelper.authHeader({ accessToken: ctx.req.body });
        const cookies = nookies.get(ctx);

        console.log('==== ME cookies ==== ', cookies);

        // TODO Tidy options
        const request = await fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
        });

        const response = await request.text();
        ctx.res.status(request.status).json(response);
    } catch (err) {
        ctx.res.status(500).send(err);
    }
}

export default handler;
