import Link from 'next/link';

interface BrandCardProps {
  brand: {
    name: string;
    slug: string;
    thumbnailUrl?: string;
    brandFields?: {
      logo?: {
        node?: {
          sourceUrl?: string;
        };
      };
    };
  };
}

const BrandCard = ({ brand }: BrandCardProps) => {
  const imageUrl = brand.thumbnailUrl || brand.brandFields?.logo?.node?.sourceUrl;
console.log({brand})
  return (
    <Link
      href={`/marque/${brand.slug}`}
      className="block bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow relative"
    >
      {imageUrl ? (
        <>
          <img
            src={imageUrl}
            alt={brand.name}
            className="w-full h-32 object-contain"
          />
          <div className="absolute bottom-2 right-4 text-sm text-gray-600 font-medium">
            {brand.name}
          </div>
        </>
      ) : (
        <div className="h-32 flex items-center justify-center">
          <span className="text-center font-bold">{brand.name}</span>
        </div>
      )}
    </Link>
  );
};

export default BrandCard;
