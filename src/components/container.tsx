import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  large?: boolean;
  small?: boolean;
}

export default function Container({
  children,
  large = false,
  small = false,
}: ContainerProps) {
  return (
    <div
      className={`w-full mx-auto px-5 md:px-6 ${
        large ? '' : small ? 'lg:max-w-[840px]' : 'xl:max-w-[1108px]'
      }`}
    >
      {children}
    </div>
  );
}
