import cookie from 'cookie';
import { NextResponse } from 'next/server';

export async function middleware(ctx) {
    const headersCookies = ctx.headers.get('cookie');
    // TODO refacto cookies
    const cookies = cookie.parse(headersCookies ? headersCookies : '');

    console.log('==== cookies.updateObjectId ==== ', cookies.updateObjectId);

    return NextResponse.next();
}
