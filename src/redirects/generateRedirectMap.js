// Script pour générer une Map optimisée
const fs = require('fs');
const path = require('path');
const { redirects } = require('./redirects');

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
  const outputPath = path.join(__dirname, 'redirectMap.json');
  fs.writeFileSync(outputPath, JSON.stringify(redirectMap, null, 2));
} catch (error) {
  console.error('Error generating redirect map:', error);
  process.exit(1);
}
