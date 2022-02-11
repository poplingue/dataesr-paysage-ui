import cookie from 'cookie';
import { NextResponse } from 'next/server';

const okPaths = [
    '/help',
    '/resources',
    '/sw',
    '/fonts/Marianne-Regular.woff',
    '/fonts/Marianne-Bold.woff2',
    '/fonts/Marianne-Bold.woff',
    '/fonts/Marianne-Regular.woff2',
    '/api/auth/refresh-access-token',
    '/favicon/favicon.ico',
    '/api/auth/sign-in',
    '/api/auth/signup',
    '/api/user/me',
    '/api/auth/refresh-access-token',
    '/api/auth/send-password-renewal-code',
    '/account/sign-in',
];

export async function middleware(request) {
    const headersCookies = request.headers.get('cookie');
    const cookies = cookie.parse(headersCookies ? headersCookies : '');
    const currentPathName = request.nextUrl.pathname;
    const pattern = okPaths.join('|');
    let re = new RegExp(pattern, 'i');

    // tokens | okPaths | home
    if (
        Object.keys(cookies).includes('tokens') ||
        re.test(currentPathName) ||
        currentPathName === '/'
    ) {
        return NextResponse.next();
    }

    if (!Object.keys(cookies).includes('tokens') && !re.test(currentPathName)) {
        return NextResponse.redirect('/account/sign-in');
    }

    return NextResponse.next();
}
