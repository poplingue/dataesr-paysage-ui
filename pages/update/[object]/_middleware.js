import { NextResponse } from 'next/server';

export async function middleware(ctx) {
    return NextResponse.next();
}
