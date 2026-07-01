/**
 * Sovereign Virtual Office — Single-Port Integrated Spatial Page
 * 
 * Natively integrates the interactive Phaser 4 spatial matrix, Jitsi meeting rooms,
 * and Proximity Audio Mesh directly into the single-port Kyrti Frontend (Port 5173).
 */
import React from 'react';
import VirtualOfficeApp from '../virtual-office-app/App.jsx';
import { WebSocketProvider } from '../virtual-office-app/network/WebSocketProvider.jsx';

export function VirtualOfficePage() {
  return (
    <div className="w-full h-[calc(100vh-64px)] overflow-hidden relative bg-[#0A0A0A]">
      <WebSocketProvider>
        <VirtualOfficeApp />
      </WebSocketProvider>
    </div>
  );
}

export default VirtualOfficePage;
