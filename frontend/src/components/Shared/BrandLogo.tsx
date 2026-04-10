import React from 'react';

interface BrandLogoProps {
  size?: number;
  showWordmark?: boolean;
  textClassName?: string;
  iconClassName?: string;
}

const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 40,
  showWordmark = true,
  textClassName = 'text-xl font-display font-bold text-foreground',
  iconClassName = '',
}) => {
  return (
    <>
      <img
        src="/subsync-logo.png"
        alt="SubSync logo"
        width={size}
        height={size}
        className={`object-contain drop-shadow-[0_10px_24px_rgba(142,92,255,0.22)] ${iconClassName}`}
      />
      {showWordmark ? <span className={textClassName}>SubSync</span> : null}
    </>
  );
};

export default BrandLogo;
