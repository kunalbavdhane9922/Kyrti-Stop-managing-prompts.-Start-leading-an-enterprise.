import React from 'react';
import { TopNavigation } from './TopNavigation';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';

export const AppLayout = ({ children }) => {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0A0A0A] text-[#EEEEEE] font-sans selection:bg-[#5E6AD2]/30">
      
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
