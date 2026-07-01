import React from 'react';
import { TopNavigation } from './TopNavigation';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';

export const AppLayout = ({ children }) => {
  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-[#FAFAFC] text-[#0F172A] font-sans selection:bg-[#FF5C00]/20">
      
      {/* Z-0: The Hero Element (Virtual Office Canvas) */}
      <div className="absolute inset-0 z-0 w-full h-full">
        {children}
      </div>
      
      {/* Z-10: Glassmorphic HUD Overlays */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col">
        
        <TopNavigation />

        <div className="flex-1 flex justify-between px-4 pb-4 mt-4 h-[calc(100vh-80px)]">
          {/* <LeftSidebar /> */}
          
          {/* Main interactive void space (Allows clicking the canvas) */}
          <div className="flex-1 pointer-events-auto" />
          
          {/* <RightSidebar /> */}
        </div>
      </div>
      
    </div>
  );
};
