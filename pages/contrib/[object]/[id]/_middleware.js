import { NextResponse } from 'next/server';

export async function middleware(request) {
    if (request.page.params) {
        const { object, id } = request.page.params;

        // set cookies
        // redirect to /contrib/[object]
        return NextResponse.redirect(
            new URL(`/contrib/${object}`, request.url)
        ).cookie('updateObjectId', id);
    } else {
        return NextResponse.redirect(new URL(`/contrib`, request.url));
    }
}
