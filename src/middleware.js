import { NextResponse } from 'next/server';
import { redirects } from './redirects/redirects';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. GESTION DE LA MAINTENANCE
  // Si on est déjà sur la page de maintenance ou sur l'API, laisser passer
  if (pathname === '/maintenance' || pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Vérifier le mode maintenance
  if (process.env.MAINTENANCE_MODE === 'true') {
    // Vérifier le cookie de maintenance
    const maintenanceAuth = request.cookies.get('maintenance_password');
    if (maintenanceAuth?.value !== process.env.MAINTENANCE_PASSWORD) {
      // Rediriger vers la page de maintenance
      const url = request.nextUrl.clone();
      url.pathname = '/maintenance';
      return NextResponse.redirect(url);
    }
  }

  // 2. GESTION DES REDIRECTIONS
  // Chercher la redirection dans votre JSON
  const redirect = redirects.find((r) => r.source === pathname);

  if (redirect) {
    // Utiliser le status code approprié selon permanent
    const statusCode = redirect.permanent ? 301 : 302;

    return NextResponse.redirect(new URL(redirect.destination, request.url), {
      status: statusCode,
    });
  }

  // 3. Continuer normalement si aucune condition n'est remplie
  return NextResponse.next();
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
