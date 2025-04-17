import React from 'react';

interface LogoProps {
  width?: number;
  height?: number;
  color?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  width = 40, 
  height = 40, 
  color = 'currentColor' 
}) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Fondo círculo */}
      <circle cx="50" cy="50" r="45" fill={color} fillOpacity="0.15" />
      
      {/* Hoja principal */}
      <path 
        d="M50 15C35 15 25 25 25 40C25 60 45 70 50 85C55 70 75 60 75 40C75 25 65 15 50 15Z" 
        fill={color} 
      />
      
      {/* Tallo */}
      <rect x="48" y="60" width="4" height="30" fill={color} />
      
      {/* Detalle hoja */}
      <path 
        d="M50 20C40 20 33 27 33 37C33 50 46 57 50 67C54 57 67 50 67 37C67 27 60 20 50 20Z" 
        fill="white" 
        fillOpacity="0.3" 
      />
      
      {/* Letra V */}
      <path 
        d="M38 45L50 57L62 45" 
        stroke="white" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
};

export default Logo; 