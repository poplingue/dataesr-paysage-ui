import cookie from 'cookie';
import getConfig from 'next/config';
import { fetchHelper } from '../../../helpers/fetch';

const { serverRuntimeConfig } = getConfig();

async function handler(req, res) {
    try {
        const url = `${serverRuntimeConfig.dataesrApiUrl}/auth/refresh-access-token`;
        const tokens = req.cookies.tokens
            ? JSON.parse(req.cookies.tokens)
            : null;
        const requestOptions = fetchHelper.requestOptions('POST', {
            refreshToken: tokens.refreshToken,
        });

        const request = await fetch(url, requestOptions);

        const response = await request.text();

        const newTokens = JSON.parse(response);

        if (newTokens && newTokens.accessToken && newTokens.refreshToken) {
            res.setHeader(
                'Set-Cookie',
                cookie.serialize('tokens', JSON.stringify(newTokens), {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== 'development',
                    maxAge: 60 * 60,
                    sameSite: 'strict',
                    path: '/',
                })
            );
        }

        res.status(request.status).json(response);
    } catch (err) {
        res.status(500).send(err);
    }
}

export default handler;
