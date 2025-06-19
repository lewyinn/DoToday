import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname } = request.nextUrl;
    const session = request.cookies.get('session')?.value;

    // Rute yang diizinkan tanpa login
    const publicRoutes = ['/', '/daftar'];

    if (publicRoutes.includes(pathname)) {
        // Jika sudah login (user/admin), redirect ke rute yang sesuai
        if (session) {
            const user = JSON.parse(session);
            const redirectUrl = 'to-do'; 
            console.log(`Middleware: Diarahkan Login user ke ${redirectUrl}`);
            return NextResponse.redirect(new URL(redirectUrl, request.url));
        }
        return NextResponse.next();
    }

    // Jika belum login, redirect ke login untuk rute selain public
    if (!session) {
        console.log(`Middleware: Session tidak ada, diarahkan ke / dari ${pathname}`);
        return NextResponse.redirect(new URL('/', request.url));
    } 
        
    // Jika session ada, lanjutkan ke rute yang diminta
    console.log(`Middleware: Session ditemukan, melanjutkan ke ${pathname}`);
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.well-known/*).*)'],
};