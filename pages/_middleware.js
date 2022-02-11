import cookie from 'cookie';
import { NextResponse } from 'next/server';

const securedPaths = [
    '/update',
    '/account/activate-account',
    '/search',
    '/object',
];

export async function middleware(request) {
    const regex = new RegExp('/[^/]+', 'g');
    const matchPath = request.nextUrl.pathname.match(regex) || [];

    const headersCookies = request.headers.get('cookie');
    const cookies = cookie.parse(headersCookies ? headersCookies : '');

    if (
        securedPaths.indexOf(matchPath[0]) > -1 &&
        !Object.keys(cookies).includes('tokens')
    ) {
        return NextResponse.redirect('/account/sign-in');
    }

    return NextResponse.next();
}
