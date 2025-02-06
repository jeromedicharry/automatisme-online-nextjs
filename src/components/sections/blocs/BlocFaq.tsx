import Container from '@/components/container';
import { Chevron } from '@/components/SVG/Icons';
import { BlocFaqProps } from '@/types/blocTypes';
import { FaqItemProps } from '@/types/Faq';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import { useRouter } from 'next/router';

const BlocFaq = ({
  bloc,
  faqItems,
}: {
  bloc: BlocFaqProps;
  faqItems: FaqItemProps[];
}) => {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaqItems, setSelectedFaqItems] = useState(faqItems);
  const router = useRouter();

  useEffect(() => {
    const hash = router.asPath.split('#')[1];

    if (hash) {
      setOpenItems((prev) => ({
        ...prev,
        [hash]: true,
      }));
    }
  }, [router.asPath]); // Supprimer faqItems et openItems des dépendances

  // Configurer Fuse.js pour la recherche floue
  const fuse = useMemo(() => {
    return new Fuse(faqItems, {
      keys: ['title', 'content'], // Les champs à chercher
      threshold: 0.4, // Plus le seuil est bas, plus la recherche est stricte
      distance: 100,
      useExtendedSearch: true,
    });
  }, [faqItems]);

  if (!bloc || !bloc.isFaq || faqItems?.length === 0) return null;

  const toggleItem = (id: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setSelectedFaqItems(faqItems);
      return;
    }
    const results = fuse.search(searchTerm).map((result) => result.item);
    setSelectedFaqItems(results);
  };

  return (
    <Container>
      <section className="mb-12 md:mb-16 p-6 md:p-8 rounded-2xl bg-primary-light">
        <form className="mb-6 md:mb-8" onSubmit={handleSearch}>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par mot clé"
              className="py-2 pl-4 pr-1 h-8 w-full bg-white border border-primary rounded-full text-sm placeholder:text-placeholder-grey"
            />
            <button
              type="submit"
              className="rounded-full bg-secondary w-6 h-6 text-white hover:bg-secondary-dark duration-300 absolute right-1 flex items-center justify-center top-[50%] transform -translate-y-1/2"
            >
              <SearchSvg />
            </button>
          </div>
        </form>
        <h2 className="text-xl md:text-2xl leading-general font-bold mb-6 md:mb-8">
          Questions les plus fréquentes
        </h2>
        <div className="flex flex-col">
          {selectedFaqItems.length > 0 ? (
            selectedFaqItems.map((item) => {
              const isOpen = openItems[item?.databaseId];

              return (
                <div
                  key={item.databaseId}
                  id={item.databaseId.toString()}
                  className="scroll-mt-4 mb-6 md:mb-8 border-b border-primary pb-6 last:border-b-0"
                >
                  <summary
                    onClick={() => toggleItem(item.databaseId)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <h3 className="font-bold leading-general">
                      {item.title} {item.databaseId}
                    </h3>
                    <span
                      className={`w-8 h-8 text-secondary rounded-md flex items-center justify-center transition-transform duration-300 ${
                        isOpen ? 'rotate-90' : 'rotate-[-90deg]'
                      }`}
                    >
                      <Chevron />
                    </span>
                  </summary>
                  <div
                    className={`transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden ${
                      isOpen
                        ? 'max-h-[1000px] opacity-100'
                        : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div
                      className="pt-6 pb-4 wysiwyg"
                      dangerouslySetInnerHTML={{ __html: item.content }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-xl md:text-2xl py-8">
              Aucune question trouvée pour le terme recherché.
            </div>
          )}
        </div>
      </section>
    </Container>
  );
};

export default BlocFaq;

export const SearchSvg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-4 h-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  );
};
