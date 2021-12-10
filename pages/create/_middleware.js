import cookie from 'cookie';
import { NextResponse } from 'next/server';
import { connectToAccessMsg } from '../../helpers/internalMessages';

export async function middleware(ctx) {
    const headersCookies = ctx.headers.get('cookie');
    // TODO refacto cookies
    const cookies = cookie.parse(headersCookies ? headersCookies : '');
    let tokens = {};

    if (Object.keys(cookies).includes('tokens')) {
        tokens = JSON.parse(cookies.tokens);
    }

    if (tokens.accessToken) {
        return NextResponse.next();
    }

    return NextResponse.redirect('/user/sign-in').cookie(
        'user-info',
        connectToAccessMsg
    );
}
