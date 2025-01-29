import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  User,
  ShoppingCart,
  Search,
} from 'lucide-react';
import Link from 'next/link';

interface MenuItem {
  label: string;
  href: string;
  subItems?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    label: 'Produits',
    href: '/produits',
    subItems: [
      {
        label: 'Catégorie 1',
        href: '/cat1',
        subItems: [
          { label: 'Sous-cat 1.1', href: '/subcat1' },
          { label: 'Sous-cat 1.2', href: '/subcat2' },
        ],
      },
      // Ajoutez d'autres catégories ici
    ],
  },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Services', href: '/services' },
  { label: 'À propos', href: '/about' },
  // Ajoutez d'autres éléments de menu ici
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  const toggleSubMenu = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label],
    );
  };

  return (
    <header
      className={`fixed w-full top-0 z-50 transform transition-transform duration-300 ${!isVisible ? '-translate-y-full' : 'translate-y-0'}`}
    >
      {/* Desktop top bar */}
      <div className="hidden lg:flex w-full">
        <Link
          href="/bibliotheque"
          className="w-1/2 bg-blue-100 py-2 text-center hover:bg-blue-200"
        >
          Bibliothèque de contenu
        </Link>
        <Link
          href="/espace-pro"
          className="w-1/2 bg-blue-800 py-2 text-center text-white hover:bg-blue-900"
        >
          Mon espace professionel
        </Link>
      </div>

      {/* Main header section */}
      <div className="bg-white shadow-lg relative">
        {/* Mobile header */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 relative z-50"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link href="/" className="flex-shrink-0">
              <img src="/logo-placeholder.png" alt="Logo" className="h-8" />
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/compte" className="text-gray-600">
                <User size={24} />
              </Link>
              <Link href="/panier" className="text-gray-600">
                <ShoppingCart size={24} />
              </Link>
            </div>
          </div>

          {/* Mobile search */}
          <div className="px-4 pb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full px-4 py-2 border rounded-lg"
              />
              <Search
                className="absolute right-3 top-2.5 text-gray-400"
                size={20}
              />
            </div>
          </div>
        </div>

        {/* Desktop header */}
        <div className="hidden lg:block container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex-shrink-0">
              <img src="/logo-placeholder.png" alt="Logo" className="h-12" />
            </Link>

            <div className="w-1/3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <Search
                  className="absolute right-3 top-2.5 text-gray-400"
                  size={20}
                />
              </div>
            </div>

            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="font-bold">4743 références</div>
                <div>544 installateurs</div>
              </div>

              <Link
                href="/trouver-installateur"
                className="text-blue-600 hover:text-blue-800"
              >
                Trouver un installateur
              </Link>

              <div className="flex items-center space-x-4">
                <Link
                  href="/compte"
                  className="text-gray-600 hover:text-gray-800"
                >
                  <User size={24} />
                </Link>
                <Link
                  href="/panier"
                  className="text-gray-600 hover:text-gray-800"
                >
                  <ShoppingCart size={24} />
                </Link>
              </div>
            </div>
          </div>

          {/* Desktop menu */}
          <nav className="border-t">
            <ul className="flex justify-between py-4">
              {menuItems.map((item) => (
                <li key={item.label} className="relative group">
                  <Link href={item.href} className="hover:text-blue-600">
                    {item.label}
                  </Link>
                  {item.subItems && (
                    <div className="absolute hidden group-hover:block w-64 bg-white shadow-lg mt-2 p-4">
                      {item.subItems.map((subItem) => (
                        <div key={subItem.label}>
                          <Link
                            href={subItem.href}
                            className="block py-2 hover:text-blue-600"
                          >
                            {subItem.label}
                          </Link>
                          {subItem.subItems && (
                            <div className="pl-4">
                              {subItem.subItems.map((subSubItem) => (
                                <Link
                                  key={subSubItem.label}
                                  href={subSubItem.href}
                                  className="block py-1 text-sm hover:text-blue-600"
                                >
                                  {subSubItem.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="absolute h-screen top-0 left-0 right-0 bottom-0 bg-white z-0 lg:hidden overflow-y-auto pt-20">
            <div className="flex justify-around p-4 border-b">
              <div>
                <div className="font-bold">4743</div>
                <div>références</div>
              </div>
              <div>
                <div className="font-bold">544</div>
                <div>installateurs</div>
              </div>
            </div>

            <nav className="p-4">
              {menuItems.map((item) => (
                <div key={item.label} className="mb-4">
                  <div
                    className="flex justify-between items-center py-2"
                    onClick={() => item.subItems && toggleSubMenu(item.label)}
                  >
                    <Link href={item.href} className="text-lg">
                      {item.label}
                    </Link>
                    {item.subItems && (
                      <ChevronRight
                        size={20}
                        className={`transform transition-transform ${
                          expandedItems.includes(item.label) ? 'rotate-90' : ''
                        }`}
                      />
                    )}
                  </div>
                  {item.subItems && expandedItems.includes(item.label) && (
                    <div className="pl-4">
                      {item.subItems.map((subItem) => (
                        <div key={subItem.label}>
                          <Link href={subItem.href} className="block py-2">
                            {subItem.label}
                          </Link>
                          {subItem.subItems && (
                            <div className="pl-4">
                              {subItem.subItems.map((subSubItem) => (
                                <Link
                                  key={subSubItem.label}
                                  href={subSubItem.href}
                                  className="block py-1 text-sm"
                                >
                                  {subSubItem.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="p-4">
              <Link
                href="/trouver-installateur"
                className="block text-center py-2 mb-4"
              >
                Trouver un installateur
              </Link>

              <Link
                href="/bibliotheque"
                className="block text-center py-3 bg-blue-100 mb-2 w-full"
              >
                Bibliothèque de contenu
              </Link>

              <Link
                href="/espace-pro"
                className="block text-center py-3 bg-blue-800 text-white w-full"
              >
                Mon espace professionel
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
