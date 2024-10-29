import { RiCoinLine } from '@remixicon/react';

interface TokenIconProps {
  icon?: string;
  className?: string;
}

function svgToDataUrl(svg: string): string {
  if (!svg) return '';

  // Generate unique IDs for any patterns, gradients, or images
  const uniqueId = Math.random().toString(36).substr(2, 9);

  svg = svg
    // Replace pattern IDs
    .replace(/pattern0/g, `pattern-${uniqueId}`)
    .replace(/image0_[^"]*"/g, `image-${uniqueId}"`)
    // Replace gradient IDs
    .replace(/id="([ab])"/g, `id="$1-${uniqueId}"`)
    .replace(/url\(#([ab])\)/g, `url(#$1-${uniqueId})`);

  // Convert to data URL
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function TokenIcon({ icon, className = 'w-4 h-4' }: TokenIconProps) {
  if (!icon) return <RiCoinLine className={className} />;

  return (
    <img
      src={svgToDataUrl(icon)}
      className={`inline-block object-contain ${className}`}
      alt=""
      style={{
        verticalAlign: 'middle',
      }}
    />
  );
}
