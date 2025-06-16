import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/atoms/Logo';
import { SearchSvg } from '../blocs/BlocFaq';
import { PinPointSvg, UserSvg } from '@/components/SVG/Icons';
import Cart from './Cart';
import Container from '@/components/container';
import { CategoryMenuProps } from '@/types/Categories';
import { BulletSvg } from '../blocs/BlocAnchorsPicto';
import DesktopParentCategorySubMenu from './DesktopParentCategorySubMenu';
import Cta from '@/components/atoms/Cta';

// Info desktop category menu has 3 variants getDisplayName, depending on ACF main category field

export default function Header({
  categoriesMenu,
  qtyInstallers,
  totalProducts,
}: {
  categoriesMenu?: CategoryMenuProps[];
  qtyInstallers?: number;
  totalProducts?: number;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleLinkClick = () => {
    setIsMenuOpen(false); // Ferme le menu après un clic sur un lien
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  const toggleSubMenu = (key: string) => {
    setExpandedItems((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    );
  };

  useEffect(() => {
    const body = document.body;
    if (isMenuOpen) {
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      body.style.overflow = 'hidden';
      body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      body.style.overflow = '';
      body.style.paddingRight = '';
    }

    return () => {
      body.style.overflow = '';
      body.style.paddingRight = '';
    };
  }, [isMenuOpen]);

  return (
    <header
      className={`fixed w-full top-0 z-50 transform transition-transform duration-300 ${!isVisible ? '-translate-y-full' : 'translate-y-0'}`}
    >
      {/* Desktop top bar */}
      <div className="hidden lg:flex w-full">
        <Link
          href="/compte"
          className="w-1/2 bg-primary py-[6px] text-center justify-center text-white hover:bg-primary-dark flex items-center gap-2 duration-300 text-sm leading-general"
        >
          Mon espace client
          <div className="max-w-1">
            <BulletSvg />
          </div>
        </Link>
        <Link
          href="/bibliotheque"
          className="w-1/2 bg-primary-ter py-[6px] text-center justify-center text-white hover:bg-primary-dark flex items-center gap-2 duration-300 text-sm leading-general"
        >
          Bibliothèque de contenu
          <div className="max-w-1">
            <BulletSvg />
          </div>
        </Link>
      </div>

      {/* Main header section */}
      <div className="bg-white shadow-card relative">
        {/* Mobile header */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 relative z-50"
            >
              {isMenuOpen ? (
                <X size={24} className="text-primary" />
              ) : (
                <Menu size={24} className="text-primary" />
              )}
            </button>
            <div className="flex-shrink-0">
              <Logo />
            </div>
            <div className="flex items-center space-x-4 text-primary">
              <Link
                href="/compte"
                className="text-primary hover:text-primary-dark duration-300"
              >
                <UserSvg />
              </Link>
              <Cart />
            </div>
          </div>

          {/* Mobile search */}
          <div className="px-4 pb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full h-8 border border-primary rounded-full pl-4 pr-10 placeholder:text-placeholder-grey"
              />
              <div className="absolute right-1 top-1 text-white w-6 h-6 flex items-center justify-center bg-secondary hover:bg-secondary-dark rounded-full">
                <SearchSvg />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop header */}
        <div className="hidden lg:block">
          <Container large>
            <div className="flex items-center justify-between py-6 gap-10">
              <div className="flex-shrink-0">
                <Logo />
              </div>

              <div className="shrink-1 lg:w-[670px]">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher un produit"
                    className="w-full h-8 border border-primary rounded-full pl-4 pr-10 placeholder:text-placeholder-grey"
                  />
                  <div className="absolute right-1 top-1 text-white w-6 h-6 flex items-center justify-center bg-secondary hover:bg-secondary-dark rounded-full">
                    <SearchSvg />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-8 shrink-0">
                <div className="flex flex-col justify-center items-center text-xs leading-general text-primary">
                  <div>
                    <span className="text-secondary">{totalProducts}</span>
                    <span> références</span>
                  </div>
                  <div>
                    <span className="text-secondary">{qtyInstallers}</span>
                    <span> installateurs</span>
                  </div>
                </div>

                <Link
                  href="/trouver-installateur"
                  className="text-primary text-sm leading-general flex items-center justify-center font-bold gap-4 text-center "
                >
                  <PinPointSvg />
                  Trouver un installateur
                </Link>

                <div className="flex items-center space-x-4">
                  <Link
                    href="/compte"
                    className="text-primary hover:text-primary-dark duration-300"
                  >
                    <UserSvg />
                  </Link>
                  <Cart />
                </div>
              </div>
            </div>

            {/* Desktop menu */}
            <nav className="">
              <ul className="flex justify-between xl:justify-evenly relative xl:gap-5">
                {categoriesMenu?.map((item) => (
                  <li
                    key={item.name}
                    className="group pb-6 duration-300 hover:border-b hover:border-primary"
                  >
                    <Link
                      href={item.uri}
                      className="whitespace-nowrap text-primary hover:text-primary-dark duration-300 font-bold text-xs leading-general flex items-center gap-1"
                    >
                      {item.name}
                      {item.children?.nodes?.length > 0 && (
                        <div className="text-secondary w-[6px] duration-300 rotate-90 group-hover:-rotate-90 hidden xl:block">
                          <BulletSvg />
                        </div>
                      )}
                    </Link>
                    <DesktopParentCategorySubMenu
                      subcategories={item.children?.nodes}
                      type={item.acfCategory?.menuType}
                      brands={item.acfCategory?.brands?.nodes}
                      image={item.image?.sourceUrl}
                      parentCategorySlug={item.uri}
                      parentCategoryName={item.name}
                    />
                  </li>
                ))}
              </ul>
            </nav>
          </Container>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="absolute h-screen top-0 left-0 right-0 bottom-0 bg-white z-0 lg:hidden overflow-y-auto pt-16">
            <div className="h-full w-full px-5 flex flex-col ">
              <div className="flex justify-around py-4 font-medium text-xl leading-general text-primary">
                <div>
                  <span className="text-secondary">{totalProducts}</span>
                  <span> références</span>
                </div>
                <div>
                  <span className="text-secondary">{qtyInstallers}</span>
                  <span> installateurs</span>
                </div>
              </div>

              <nav className="py-4">
                {/* Page niveau 1 - Liste des catégories mères */}
                {!expandedItems.length && (
                  <>
                    {categoriesMenu?.map((item) => (
                      <div key={item.name} className="">
                        <div
                          className="flex justify-between items-center py-4 border-b border-primary cursor-pointer"
                          onClick={() =>
                            item.children?.nodes?.length > 0 &&
                            toggleSubMenu(item.name)
                          }
                        >
                          <span className="font-bold text-primary">
                            {item.name}
                          </span>
                          {item.children?.nodes?.length > 0 && (
                            <div className="text-secondary">
                              <BulletSvg />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {/* Page niveau 2 - Catégorie mère sélectionnée + ses enfants */}
                {expandedItems.length === 1 && (
                  <>
                    {categoriesMenu?.map((item) => {
                      if (!expandedItems.includes(item.name)) return null;

                      return (
                        <div key={item.name}>
                          {/* Bouton retour */}
                          <div className="flex justify-between items-center pb-10">
                            <button
                              onClick={() => toggleSubMenu(item.name)}
                              className="flex items-center gap-2 text-secondary font-bold"
                            >
                              <div className="text-secondary rotate-180">
                                <BulletSvg />
                              </div>
                              Retour
                            </button>
                          </div>

                          {/* Bouton "Voir tout" pour la catégorie niveau 1 */}
                          <div className="w-fit py-4">
                            <Cta
                              slug={item.uri}
                              label="Voir tout"
                              variant="primaryHollow"
                              size="mobile-header"
                            >
                              {item.name}
                            </Cta>
                          </div>

                          {/* Liste des catégories niveau 2 */}
                          {item.children?.nodes?.map((subItem) => (
                            <div key={subItem.name}>
                              <div
                                className="flex justify-between items-center py-4 border-b border-primary cursor-pointer"
                                onClick={() =>
                                  subItem.children?.nodes?.length > 0
                                    ? toggleSubMenu(
                                        `${item.name}-${subItem.name}`,
                                      )
                                    : null
                                }
                              >
                                {subItem.children?.nodes?.length > 0 ? (
                                  <span className="font-bold text-primary">
                                    {subItem.name}
                                  </span>
                                ) : (
                                  <Link
                                    href={subItem.uri}
                                    className="font-bold text-primary"
                                    onClick={handleLinkClick}
                                  >
                                    {subItem.name}
                                  </Link>
                                )}
                                {subItem.children?.nodes?.length > 0 && (
                                  <div className="text-secondary">
                                    <BulletSvg />
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </>
                )}

                {/* Page niveau 3 - Sous-catégorie sélectionnée + ses enfants */}
                {expandedItems.length === 2 && (
                  <>
                    {categoriesMenu?.map((item) => {
                      if (!expandedItems.includes(item.name)) return null;

                      return item.children?.nodes?.map((subItem) => {
                        if (
                          !expandedItems.includes(
                            `${item.name}-${subItem.name}`,
                          )
                        )
                          return null;

                        return (
                          <div key={subItem.name}>
                            {/* Bouton retour */}
                            <div className="flex justify-between items-center pb-10">
                              <button
                                onClick={() =>
                                  toggleSubMenu(`${item.name}-${subItem.name}`)
                                }
                                className="flex items-center gap-2 text-secondary font-bold"
                              >
                                <div className="text-secondary rotate-180">
                                  <BulletSvg />
                                </div>
                                Retour
                              </button>
                            </div>

                            {/* Bouton "Voir tout" pour la catégorie niveau 2 */}
                            <div className="w-fit py-4">
                              <Cta
                                slug={subItem.uri}
                                label="Voir tout"
                                variant="primaryHollow"
                                size="mobile-header"
                              >
                                {subItem.name}
                              </Cta>
                            </div>

                            {/* Liste des catégories niveau 3 (liens finaux) */}
                            {subItem.children?.nodes?.map((subSubItem) => (
                              <div
                                key={subSubItem.name}
                                className="flex justify-between items-center py-4 border-b border-primary"
                              >
                                <Link
                                  href={subSubItem.uri}
                                  className="font-bold text-primary"
                                  onClick={handleLinkClick}
                                >
                                  {subSubItem.name}
                                </Link>
                              </div>
                            ))}
                          </div>
                        );
                      });
                    })}
                  </>
                )}
              </nav>

              <div className="pt-4 mt-auto">
                <Link
                  href="/trouver-installateur"
                  className="text-primary flex items-center justify-center font-bold gap-4 text-center py-4 mb-6"
                >
                  <PinPointSvg />
                  Trouver un installateur
                </Link>

                <Link
                  href="/bibliotheque"
                  className="block text-center py-5 text-sm leading-general bg-primary-ter text-white w-screen relative left-1/2 -translate-x-1/2"
                >
                  Bibliothèque de contenu
                </Link>

                <Link
                  href="/espace-pro"
                  className="block text-center py-5 text-sm leading-general bg-primary text-white w-screen relative left-1/2 -translate-x-1/2"
                >
                  Mon espace professionel
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
