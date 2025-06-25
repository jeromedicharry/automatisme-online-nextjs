import { BulletSvg } from '@/components/sections/blocs/BlocAnchorsPicto';
import Image from 'next/image';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { VideoCardProps } from '.';

const VideoCard = ({ bloc }: { bloc: VideoCardProps }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  useEffect(() => {
    if (isPlaying && iframeRef.current) {
      const requestFullscreen = async () => {
        try {
          await iframeRef.current?.requestFullscreen();
        } catch (error) {
          console.log('Fullscreen not supported');
        }
      };
      requestFullscreen();
    }
  }, [isPlaying]);

  if (!bloc || !bloc.videoId) return null;
  return (
    <div
      className={`relative w-full max-lg:aspect-video lg:h-[388px] rounded-lg overflow-hidden`}
    >
      {isPlaying ? (
        <iframe
          ref={iframeRef}
          className="w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${bloc.videoId}?autoplay=1&enablejsapi=1&fs=1&playsinline=0&rel=0&modestbranding=1`}
          title="YouTube video"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
          style={{ border: 0 }}
        />
      ) : (
        <div
          className="relative w-full h-full cursor-pointer"
          onClick={handlePlay}
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
  );
};

export default VideoCard;
