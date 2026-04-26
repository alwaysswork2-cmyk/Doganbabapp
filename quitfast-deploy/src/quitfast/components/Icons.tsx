import React from 'react';

export const Goal30DIcon = ({ size = 30, className = "" }: { size?: number, className?: string }) => (
  <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
    {/* Premium Rounded Square Background with Neon Glow */}
    <div className="absolute inset-0 rounded-[8px] border border-current/30 bg-current/5 shadow-[0_0_15px_rgba(59,130,246,0.25)] backdrop-blur-sm transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]" />
    
    <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
      {/* Minimalist Calendar Line Style */}
      <rect x="2" y="4" width="20" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M2 9H22" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7 2V6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M17 2V6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      
      {/* Bold Number 30 */}
      <text 
        x="12" 
        y="18" 
        textAnchor="middle" 
        fill="currentColor" 
        fontSize="9.5" 
        fontWeight="900" 
        style={{ fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '-0.02em' }}
      >
        30
      </text>
    </svg>
  </div>
);
