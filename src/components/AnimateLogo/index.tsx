import React from 'react';

interface AnimatedLogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ size = 150, className, ...props }) => {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} {...props}>
      <style>
        {`
        .flowing-track {
            animation: stroke-flow 3s linear infinite;
          }

          @keyframes stroke-flow {
            /* Mantém a linha perfeitamente colada à traseira do triângulo */
            0%   { stroke-dashoffset: 35; }
            100% { stroke-dashoffset: -65; }
          }

          @media (prefers-reduced-motion: reduce) {
          .flowing-track,.arrow-head { animation: none; }
          }
        `}
      </style>

      <g id="logo">
        {/* PLAY ESTÁTICO (Centro) */}
        <path
          id="play"
          fill="#fff"
          d="M14.31,10.95c.77.43.78,1.52.03,1.97l-3.44,2.06c-.75.45-1.71-.08-1.73-.96l-.06-4.01c-.01-.88.93-1.44,1.69-1.01l3.5,1.95Z"
        />

        {/* TRACK RETANGULAR (Corpo/Cauda das setas) */}
        <path
          id="track-path"
          d="M 19,6 L 5,6 A 2,2 0 0 0 3,8 L 3,16 A 2,2 0 0 0 5,18 L 19,18 A 2,2 0 0 0 21,16 L 21,8 A 2,2 0 0 0 19,6 Z"
          pathLength="100"
          fill="none"
          stroke="#fff"
          strokeWidth="1.5"
          strokeDasharray="35 15"
          strokeLinecap="square"
          className="flowing-track"
        />

        {/* SETA 1 - Triângulo Retângulo Sólido */}
        <g className="arrow-head">
          <animateMotion dur="3s" repeatCount="indefinite" rotate="auto">
            <mpath href="#track-path" />
          </animateMotion>
          {/* O polígono agora é um triângulo com a ponta em exatamente 90 graus */}
          <polygon points="-1,-1 7,-1 -1,3" fill="#fff" />
        </g>

        {/* SETA 2 - Começa na metade do ciclo */}
        <g className="arrow-head">
          <animateMotion begin="-1.5s" dur="3s" repeatCount="indefinite" rotate="auto">
            <mpath href="#track-path" />
          </animateMotion>
          <polygon points="-1,-1 7,-1 -1,3" fill="#fff" />
        </g>
      </g>
    </svg>
  );
};
