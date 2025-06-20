import { NextResponse } from 'next/server';

export function middleware(request) {
  // Si on est déjà sur la page de maintenance ou sur l'API, laisser passer
  if (
    request.nextUrl.pathname === '/maintenance' ||
    request.nextUrl.pathname.startsWith('/api/')
  ) {
    return NextResponse.next();
  }

  // Vérifier le mode maintenance
  if (process.env.MAINTENANCE_MODE !== 'true') {
    return NextResponse.next();
  }

  // Vérifier le cookie de maintenance
  const maintenanceAuth = request.cookies.get('maintenance_password');
  if (maintenanceAuth?.value === process.env.MAINTENANCE_PASSWORD) {
    return NextResponse.next();
  }

  // Rediriger vers la page de maintenance
  const url = request.nextUrl.clone();
  url.pathname = '/maintenance';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
