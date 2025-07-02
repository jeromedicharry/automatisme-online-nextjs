// src/redirects/redirectMap.js - Script pour générer une Map optimisée
const fs = require('fs');
const path = require('path');

try {
  const redirects = require('./redirects');

  // Convertir en Map pour des recherches O(1)
  const redirectMap = {};
  redirects.forEach((redirect) => {
    redirectMap[redirect.source] = {
      destination: redirect.destination,
      permanent: redirect.permanent,
    };
  });

  // Écrire le fichier optimisé
  const outputPath = path.join(__dirname, 'redirectMap.json');
  fs.writeFileSync(outputPath, JSON.stringify(redirectMap, null, 2));
} catch (error) {
  console.error('Error generating redirect map:', error);
  process.exit(1);
}

// middleware.js - Version optimisée
import { NextResponse } from 'next/server';
import redirectMap from './src/redirects/redirectMap.json';

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
