import cookie from 'cookie';
import { NextResponse } from 'next/server';

export async function middleware(ctx) {
    const headersCookies = ctx.headers.get('cookie');
    const cookies = cookie.parse(headersCookies ? headersCookies : '');

    if (Object.keys(cookies).includes('tokens')) {
        return NextResponse.next();
    }

    return NextResponse.redirect('/account/sign-in');
}
