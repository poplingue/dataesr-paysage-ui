import { NextResponse } from 'next/server';

export async function middleware(request) {
    if (request.page.params) {
        const { object, id } = request.page.params;

        // set cookies
        // redirect to /update/[object]
        return NextResponse.redirect(
            new URL(`/update/${object}`, request.url)
        ).cookie('updateObjectId', id);
    } else {
        return NextResponse.redirect(new URL(`/update`, request.url));
    }
}
