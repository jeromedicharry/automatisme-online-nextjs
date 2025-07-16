import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Logo = ({ isFooter = false }) => {
  const src = isFooter
    ? '/images/logo-automatisme-online-footer.png'
    : '/images/logo-automatisme-online.png';

  return (
    <Link href="/" className="block z-10" title="Home page">
      <div className={`transition duration-300}`}>
        <div
          className={`${isFooter ? 'w-[240px]' : 'w-[121px] md:w-[138px] lg:w-[160px]'}`}
        >
          <Image
            src={src}
            alt="Logo automatisme online"
            width={275}
            height={73}
            className="block w-full object-cover"
          />
        </div>
      </div>
    </Link>
  );
};

export default Logo;
