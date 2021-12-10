import cookie from 'cookie';
import { NextResponse } from 'next/server';

export async function middleware(req) {
    const headersCookies = req.headers.get('cookie');

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
        'Connectez vous pour activer votre compte'
    );
}
