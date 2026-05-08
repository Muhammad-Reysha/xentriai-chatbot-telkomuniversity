import React from 'react';

export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="200" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="40%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      
      <g stroke="url(#logo-grad)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        {/* Top-left antenna */}
        <path d="M 75 60 L 55 40" />
        
        {/* Top head rim */}
        <path d="M 60 85 L 85 55 L 130 55" />
        
        {/* Middle chin/jaw */}
        <path d="M 60 85 L 85 120 L 125 120 L 150 135" />
        
        {/* Right curved line */}
        <path d="M 140 55 C 165 55, 165 100, 140 105 C 130 107, 145 120, 165 100" />
        
        {/* Bottom free-floating wire */}
        <path d="M 40 105 C 55 145, 90 145, 125 140 C 135 138, 140 155, 130 155" />
      </g>
      
      {/* Eyes */}
      <circle cx="100" cy="80" r="12" fill="#4ade80" />
      <circle cx="135" cy="80" r="12" fill="#2dd4bf" />
      
      {/* End caps / nodes */}
      <g fill="url(#logo-grad)">
        <circle cx="60" cy="85" r="7" />
        <circle cx="130" cy="55" r="7" />
        <circle cx="150" cy="135" r="7" />
        
        <circle cx="140" cy="55" r="7" />
        
        <circle cx="40" cy="105" r="7" />
        <circle cx="130" cy="155" r="7" />
      </g>
    </svg>
  );
}
