import React from 'react';

/**
 * Firecrawl-style grid background with intersection dots, spotlight, and fade.
 * Usage: <GridBackground> ... your content ... </GridBackground>
 */
const GridBackground = ({ children, className = '', showDecorators = false }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Grid lines */}
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      {/* Intersection dots */}
      <div className="absolute inset-0 bg-grid-dots pointer-events-none" />
      {/* Radial spotlight */}
      <div className="absolute inset-0 bg-spotlight pointer-events-none" />
      {/* Bottom fade into background */}
      <div className="absolute inset-0 bg-fade-b pointer-events-none" />
      
      {/* Floating monospace decorators */}
      {showDecorators && (
        <>
          <div className="absolute top-16 left-8 md:left-20 text-[10px] font-mono text-muted-foreground/40 hidden lg:block select-none">
            [ STATUS: 200 OK ]
          </div>
          <div className="absolute top-28 right-8 md:right-20 text-[10px] font-mono text-muted-foreground/40 hidden lg:block select-none">
            {`{ jobs: "loaded" }`}
          </div>
          <div className="absolute bottom-24 left-12 md:left-32 text-[10px] font-mono text-muted-foreground/30 hidden lg:block select-none">
            ✦
          </div>
          <div className="absolute bottom-40 right-16 md:right-40 text-[10px] font-mono text-primary/20 hidden lg:block select-none">
            ✦
          </div>
        </>
      )}

      {/* Content layer */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default GridBackground;
