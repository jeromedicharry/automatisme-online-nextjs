import { useState } from 'react';
import Image from 'next/image';
import { BulletSvg } from './BlocAnchorsPicto';
import { BlocVideoProps } from '@/types/blocTypes';
import Container from '@/components/container';
import BlocIntroSmall from '@/components/atoms/BlocIntroSmall';

const BlocVideo = ({ bloc }: { bloc: BlocVideoProps }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  if (!bloc || !bloc.videoId) return null;
  return (
    <Container>
      <section>
        <BlocIntroSmall title={bloc.title} />
        <div className="relative w-full max-lg:aspect-video lg:h-[600px] rounded-lg overflow-hidden mb-12 md:mb-16">
          {isPlaying ? (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${bloc.videoId}?autoplay=1`}
              title="YouTube video"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          ) : (
            <div
              className="relative w-full h-full cursor-pointer"
              onClick={() => setIsPlaying(true)}
            >
              <Image
                src={
                  bloc.image?.node?.sourceUrl ||
                  `https://img.youtube.com/vi/${bloc.videoId}/maxresdefault.jpg`
                }
                alt="Vidéo Automatisme Online"
                layout="fill"
                objectFit="cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <button className="playButton p-4 bg-white text-secondary rounded-full shadow-lg flex justify-center items-center w-16 h-16 hover:bg-secondary hover:text-white duration-300">
                  <BulletSvg />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </Container>
  );
};

export default BlocVideo;
