import Head from 'next/head';
import parse from 'html-react-parser';

export interface IMeta {
  metaDesc?: string;
  title?: string;
  fullHead?: string;
  breadcrumbs?: {
    text: string;
    url: string;
  }[];
}

export default function Meta({
  meta,
  uri = '',
  excludeSeo = false,
}: {
  meta: IMeta;
  uri?: string;
  excludeSeo?: boolean;
}) {
  // Ensure meta.fullHead is a string
  const rawFullHead = meta?.fullHead || '';
  const cleanFullHead = cleanSeo(rawFullHead);
  const parsedCleanHead = parse(cleanFullHead);

  const canonical = process.env.NEXT_PUBLIC_WEBSITE_URL + uri;

  return (
    <Head>
      <meta httpEquiv="x-ua-compatible" content="ie=edge"></meta>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      ></meta>
      {excludeSeo && <meta name="robots" content="noindex, nofollow" />}
      {/* Favicon and icons */}
      <link
        rel="apple-touch-icon"
        sizes="57x57"
        href="/favicon/apple-icon-57x57.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="60x60"
        href="/favicon/apple-icon-60x60.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="72x72"
        href="/favicon/apple-icon-72x72.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="76x76"
        href="/favicon/apple-icon-76x76.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="114x114"
        href="/favicon/apple-icon-114x114.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="120x120"
        href="/favicon/apple-icon-120x120.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="144x144"
        href="/favicon/apple-icon-144x144.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="152x152"
        href="/favicon/apple-icon-152x152.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/favicon/apple-icon-180x180.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="192x192"
        href="/favicon/android-icon-192x192.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="96x96"
        href="/favicon/favicon-96x96.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon/favicon-16x16.png"
      />
      <link rel="manifest" href="/favicon/manifest.json" />
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta
        name="msapplication-TileImage"
        content="/favicon/ms-icon-144x144.png"
      />
      <meta name="theme-color" content="#ffffff" />
      <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      <title>{meta?.title}</title>
      <meta name="description" content={meta?.metaDesc} />
      {parsedCleanHead}
      {uri && <link rel="canonical" href={canonical}></link>}
    </Head>
  );
}

export const cleanSeo = (fullHead: string): string => {
  if (
    !process.env.NEXT_PUBLIC_ADMIN_URL ||
    !process.env.NEXT_PUBLIC_WEBSITE_URL
  )
    return fullHead;

  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL;
  const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;

  // Utilisation d'une expression régulière avec le flag 'g' pour remplacer toutes les occurrences,
  const regex = new RegExp(`(${adminUrl}[^\\s"']*)`, 'g');

  return fullHead.replace(regex, (match) => {
    // Vérifier si l'URL contient "upload"
    if (match.includes('uploads')) {
      return match; // Ne pas remplacer si "upload" est présent
    }
    return match.replace(adminUrl, websiteUrl); // Remplacer sinon
  });
};
