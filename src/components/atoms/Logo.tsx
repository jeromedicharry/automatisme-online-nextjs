import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Logo = ({ isFooter = false }) => {
  const src = isFooter
    ? '/images/logo-footer-automatisme-online.png'
    : '/images/logo-automatisme-online.png';

  return (
    <Link href="/" className="block relative z-10" title="Home page">
      <div className={`transition duration-300}`}>
        <div className="max-w-[100px] lg:max-w-[138px]">
          <Image
            src={src}
            alt="Logo automatisme online"
            width={276}
            height={73}
            className="w-[138px] object-cover"
          />
        </div>
      </div>
    </Link>
  );
};

export default Logo;
