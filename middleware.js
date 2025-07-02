const { NextResponse } = require('next/server');
const redirectMap = require('./src/redirects/redirectMap.json');

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};

export default function middleware(request) {
  const { pathname } = request.nextUrl;

  // Recherche O(1) au lieu de O(n)
  const redirect = redirectMap[pathname];

  if (redirect) {
    const statusCode = redirect.permanent ? 301 : 302;

    return NextResponse.redirect(new URL(redirect.destination, request.url), {
      status: statusCode,
    });
  }

  return NextResponse.next();
}
