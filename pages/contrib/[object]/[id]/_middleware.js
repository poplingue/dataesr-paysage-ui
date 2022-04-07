import { NextResponse } from 'next/server';

export async function middleware(request) {
    if (request.page.params) {
        const { object, id, resourceId } = request.page.params;

        const hash = resourceId ? `#${resourceId}` : '';

        if (!id && !resourceId) {
            // case /contrib/[object]/import
            return NextResponse.next();
        }

        // set cookies
        // redirect to /contrib/[object]
        return NextResponse.redirect(
            new URL(`/contrib/${object}${hash}`, request.url)
        ).cookie('updateObjectId', id);
    } else {
        return NextResponse.redirect(new URL(`/contrib`, request.url));
    }
}
