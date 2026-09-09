import React from 'react';

interface SectionEyebrowProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionEyebrow({ children, className = '' }: SectionEyebrowProps) {
  return (
    <span 
      id={`eyebrow-${children?.toString().toLowerCase().replace(/\s+/g, '-')}`}
      className={`block text-xs font-mono tracking-[0.2em] uppercase text-terracotta font-semibold mb-3 ${className}`}
    >
      {children}
    </span>
  );
}
