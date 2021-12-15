import cookie from 'cookie';
import { NextResponse } from 'next/server';

export function middleware(req) {
    const headersCookies = req.headers.get('cookie');
    // TODO refacto cookies
    const cookies = cookie.parse(headersCookies ? headersCookies : '') || {};

    if (
        Object.keys(cookies).length > 0 &&
        Object.keys(cookies).includes('userConnected') &&
        cookies.userConnected === 'true'
    ) {
        return NextResponse.redirect('/');
    } else {
        return NextResponse.next();
    }
}
