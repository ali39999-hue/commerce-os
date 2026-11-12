import React from 'react';

export function EmptyCartIllustration({
  className,
  style,
  size = 140,
}: {
  className?: string;
  style?: React.CSSProperties;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Floating leaves above cart */}
      <path
        d="M68 18C68 18 72 14 78 16C84 18 82 24 82 24C82 24 76 25 72 22C68 19 68 18 68 18Z"
        stroke="#5A6A85"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M80 16C80 16 85 12 91 14C97 16 95 22 95 22C95 22 89 23 85 20C81 17 80 16 80 16Z"
        stroke="#5A6A85"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Curved dotted trails */}
      <path
        d="M56 34C68 28 84 28 98 36"
        stroke="#94A3B8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="2 5"
      />
      <path
        d="M50 42C62 36 78 36 92 44"
        stroke="#CBD5E1"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeDasharray="2 5"
      />

      {/* Speed ticks near handle */}
      <path d="M42 30L38 28" stroke="#5A6A85" strokeWidth="2" strokeLinecap="round" />
      <path d="M44 26L40 22" stroke="#5A6A85" strokeWidth="2" strokeLinecap="round" />
      <path d="M48 24L48 18" stroke="#5A6A85" strokeWidth="2" strokeLinecap="round" />

      {/* Floating small circles */}
      <circle cx="43" cy="52" r="2" stroke="#5A6A85" strokeWidth="1.5" />
      <circle cx="38" cy="74" r="2" stroke="#5A6A85" strokeWidth="1.5" />

      {/* Ground line */}
      <path d="M34 112H102" stroke="#475569" strokeWidth="3" strokeLinecap="round" />

      {/* Cart Handle & Frame */}
      <path
        d="M32 38H45L55 86H97L109 46H48"
        stroke="#475569"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M47 86H41" stroke="#475569" strokeWidth="3.2" strokeLinecap="round" />

      {/* Inner Slats (Soft vertical rounded bars) */}
      <path d="M66 52V76" stroke="#5A6A85" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M78 52V76" stroke="#5A6A85" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M90 52V74" stroke="#5A6A85" strokeWidth="4.5" strokeLinecap="round" />

      {/* Wheels */}
      <circle cx="56" cy="102" r="7" stroke="#475569" strokeWidth="3.2" fill="#FFFFFF" />
      <circle cx="56" cy="102" r="2.5" fill="#475569" />

      <circle cx="88" cy="102" r="7" stroke="#475569" strokeWidth="3.2" fill="#FFFFFF" />
      <circle cx="88" cy="102" r="2.5" fill="#475569" />

      {/* Wheel Axle */}
      <path d="M56 102H88" stroke="#475569" strokeWidth="3.2" strokeLinecap="round" />

      {/* Circular Badge with Orange X */}
      <circle
        cx="98"
        cy="78"
        r="14"
        fill="#FFFFFF"
        stroke="#5A6A85"
        strokeWidth="2.5"
      />
      {/* Orange Cross inside Badge */}
      <path
        d="M91 71L105 85"
        stroke="#E68A1D"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M105 71L91 85"
        stroke="#E68A1D"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export const EmptyCartWithXIcon = EmptyCartIllustration;
