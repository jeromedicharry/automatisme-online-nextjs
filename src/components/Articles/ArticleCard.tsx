import Link from 'next/link';

interface ArticleCardProps {
  article: {
    title: string;
    excerpt: string;
    slug: string;
    date: string;
    productBrands?: {
      nodes: {
        name: string;
      }[];
    };
    featuredImage?: {
      node?: {
        sourceUrl?: string;
      };
    };
  };
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
    <Link href={`/article/${article.slug}`}>
      <a className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
        {article.featuredImage?.node?.sourceUrl && (
          <div className="relative h-48">
            <img
              src={article.featuredImage.node.sourceUrl}
              alt={article.title}
              className="w-full h-full object-cover rounded-t-lg"
            />
          </div>
        )}
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2">{article.title}</h3>
          <div
            className="text-gray-600 mb-4 line-clamp-3"
            dangerouslySetInnerHTML={{ __html: article.excerpt }}
          />
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>{new Date(article.date).toLocaleDateString()}</span>
            {article.productBrands?.nodes[0]?.name && (
              <span className="text-primary">{article.productBrands.nodes[0].name}</span>
            )}
          </div>
        </div>
      </a>
    </Link>
  );
};

export default ArticleCard;
