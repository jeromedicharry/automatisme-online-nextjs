import { useContext, useState, useEffect } from 'react';
import Link from 'next/link';

import { CartContext } from '@/stores/CartProvider';

const Cart = () => {
  const { cart } = useContext(CartContext);
  const [productCount, setProductCount] = useState<number | null | undefined>(
    null,
  );

  useEffect(() => {
    if (cart) {
      setProductCount(cart.totalProductsCount);
    } else {
      setProductCount(null);
    }
  }, [cart]);

  return (
    <>
      <Link
        href="/panier"
        className="relative flex w-8 h-8 p-1"
        aria-label="Voir le panier"
        title="Voir le panier"
      >
        <svg viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M21.1693 5.63565C20.6949 5.06647 19.9919 4.73695 19.2512 4.73852H5.78194L5.74728 4.44526C5.59912 3.18708 4.53369 2.23793 3.26652 2.23793H3.08211C2.62189 2.23793 2.24835 2.6116 2.24835 3.07199C2.24835 3.53237 2.62189 3.90604 3.08211 3.90604H3.26652C3.68891 3.90604 4.04353 4.22295 4.09396 4.64235L5.23978 14.3925C5.48565 16.491 7.26348 18.074 9.37701 18.074H18.077C18.5372 18.074 18.9108 17.7003 18.9108 17.2399C18.9108 16.7795 18.5372 16.4059 18.077 16.4059H9.37701C8.32103 16.4027 7.3801 15.7358 7.02863 14.7393H16.958C18.9738 14.7393 20.6996 13.2967 21.0574 11.3116L21.7115 7.68374C21.8439 6.95532 21.6453 6.20482 21.1693 5.63722V5.63565ZM20.0755 7.38575L19.4214 11.0137C19.2071 12.2056 18.1684 13.0728 16.958 13.0696H6.76384L5.98053 6.40348H19.2528C19.713 6.40033 20.0881 6.77085 20.0912 7.23123C20.0912 7.28326 20.0865 7.33372 20.0786 7.38417L20.0755 7.38575Z"
            fill="#042B60"
          />
          <path
            d="M8.07986 22.2379C8.99992 22.2379 9.74579 21.4918 9.74579 20.5714C9.74579 19.651 8.99992 18.9048 8.07986 18.9048C7.15979 18.9048 6.41394 19.651 6.41394 20.5714C6.41394 21.4918 7.15979 22.2379 8.07986 22.2379Z"
            fill="#042B60"
          />
          <path
            d="M16.4095 22.2379C17.3296 22.2379 18.0754 21.4918 18.0754 20.5714C18.0754 19.651 17.3296 18.9048 16.4095 18.9048C15.4895 18.9048 14.7436 19.651 14.7436 20.5714C14.7436 21.4918 15.4895 22.2379 16.4095 22.2379Z"
            fill="#042B60"
          />
        </svg>
        {productCount && productCount > 0 ? (
          <span
            className={`rounded-full text-[11px] min-w-5 min-h-5 flex items-center justify-center absolute -top-1 -right-1 bg-secondary text-white leading-none font-semibold px-1`}
          >
            {productCount}
          </span>
        ) : null}
      </Link>
    </>
  );
};

export default Cart;
