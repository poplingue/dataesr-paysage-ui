import { NextResponse } from 'next/server';

export async function middleware(ctx) {
    const { object, id } = ctx.page.params;

    // set cookies
    // redirect to /update/object
    return NextResponse.redirect(`/update/${object}`).cookie(
        'updateObjectId',
        id
    );
}
