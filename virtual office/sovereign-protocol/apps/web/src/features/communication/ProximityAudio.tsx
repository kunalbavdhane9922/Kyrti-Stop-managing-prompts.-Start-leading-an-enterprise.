import React, { useEffect, useRef, useState } from 'react';
import { useSpatialStore } from '../../shared/store/useSpatialStore';

// Note: Requires @jitsi/react-sdk in package.json
import { JitsiMeeting } from '@jitsi/react-sdk';

export const ProximityAudio: React.FC = () => {
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Listen for WebSocket commands routed through the Spatial Store or window events
    const handleProximityEnter = (e: any) => {
      const { room_id } = e.detail;
      setActiveRoom(room_id);
    };

    const handleProximityLeave = () => {
      setActiveRoom(null);
    };

    window.addEventListener('PROXIMITY_ENTER', handleProximityEnter);
    window.addEventListener('PROXIMITY_LEAVE', handleProximityLeave);

    return () => {
      window.removeEventListener('PROXIMITY_ENTER', handleProximityEnter);
      window.removeEventListener('PROXIMITY_LEAVE', handleProximityLeave);
    };
  }, []);

  if (!activeRoom) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 w-72 bg-[#0f172a]/90 backdrop-blur-xl border border-[#1e293b] rounded-2xl shadow-2xl overflow-hidden font-sans">
      <div className="px-4 py-3 border-b border-[#1e293b] flex justify-between items-center bg-indigo-500/10">
        <span className="text-sm font-semibold text-indigo-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Spatial Audio Active
        </span>
      </div>
      
      {/* Hidden Jitsi Iframe to handle the actual WebRTC mesh */}
      <div className="hidden">
        <JitsiMeeting
          domain="meet.jit.si"
          roomName={activeRoom}
          configOverwrite={{
            startWithAudioMuted: false,
            startWithVideoMuted: true,
            disableModeratorIndicator: true,
          }}
          interfaceConfigOverwrite={{
            DISABLE_VIDEO_BACKGROUND: true
          }}
          onApiReady={(externalApi) => {
            if (isMuted) externalApi.executeCommand('toggleAudio');
          }}
        />
      </div>

      <div className="p-4 flex flex-col gap-3">
        <div className="text-xs text-slate-400">Connected to nearby peers.</div>
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
            isMuted 
              ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30' 
              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
          }`}
        >
          {isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
        </button>
      </div>
    </div>
  );
};
