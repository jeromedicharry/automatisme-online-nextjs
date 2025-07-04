import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  const doofinderScript = `
    const dfLayerOptions = {
      installationId: '${process.env.NEXT_PUBLIC_DOOFINDER_INSTALLATION_ID}',
      zone: 'eu1',
    };

    (function (l, a, y, e, r, s) {
      r = l.createElement(a); 
      r.onload = e; 
      r.async = 1; 
      r.src = y;
      s = l.getElementsByTagName(a)[0]; 
      s.parentNode.insertBefore(r, s);
    })(document, 'script', 'https://cdn.doofinder.com/livelayer/1/js/loader.min.js', function () {
      doofinderLoader.load(dfLayerOptions);
    });
  `;
  return (
    <Html lang="fr-FR">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        {/* Script Doofinder */}
        {process.env.NEXT_PUBLIC_DOOFINDER_INSTALLATION_ID && (
          <script dangerouslySetInnerHTML={{ __html: doofinderScript }} />
        )}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
