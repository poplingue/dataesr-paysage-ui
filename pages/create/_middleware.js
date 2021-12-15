import cookie from 'cookie';
import { NextResponse } from 'next/server';

export async function middleware(ctx) {
    const headersCookies = ctx.headers.get('cookie');
    // TODO refacto cookies
    const cookies = cookie.parse(headersCookies ? headersCookies : '');

    if (
        Object.keys(cookies).includes('userConnected') &&
        cookies.userConnected === 'true'
    ) {
        return NextResponse.next();
    }

    return NextResponse.redirect('/user/sign-in');
}
