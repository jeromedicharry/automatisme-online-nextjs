// Script pour générer une Map optimisée
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { redirects } from './redirects.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {

  // Convertir en Map pour des recherches O(1)
  const redirectMap = {};
  redirects.forEach((redirect) => {
    redirectMap[redirect.source] = {
      destination: redirect.destination,
      permanent: redirect.permanent,
    };
  });

  // Écrire le fichier optimisé
  const outputPath = join(__dirname, 'redirectMap.json');
  writeFileSync(outputPath, JSON.stringify(redirectMap, null, 2));
} catch (error) {
  console.error('Error generating redirect map:', error);
  process.exit(1);
}
