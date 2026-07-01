import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Mic, MicOff, Video, VideoOff, Monitor, Phone, MessageSquare,
  X, Send, Users, Clock, FileText
} from 'lucide-react';
import {
  getProfessionalById,
  getMeetingById,
  MEETING_SCRIPTS,
  DIGITAL_PROFESSIONALS,
} from '../data/marketplaceData.js';

/**
 * Sovereign Protocol — Meeting Room
 * Multi-participant Google Meet-style environment with AI team members.
 * Predefined conversation scripts play automatically with voice synthesis.
 */
export default function MeetingRoomPage() {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const meeting = getMeetingById(meetingId);

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [showTranscript, setShowTranscript] = useState(true);
  const [transcript, setTranscript] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [meetingTime, setMeetingTime] = useState(0);
  const [speakingId, setSpeakingId] = useState(null);
  const [scriptIndex, setScriptIndex] = useState(0);
  const [meetingNotes, setMeetingNotes] = useState([]);
  const [hasJoined, setHasJoined] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const transcriptEndRef = useRef(null);
  const scriptTimerRef = useRef(null);
  const voicesRef = useRef([]);

  // Pre-load speech synthesis voices (they load asynchronously in most browsers)
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
  }, []);

  const participants = meeting?.participants.map(id => getProfessionalById(id)).filter(Boolean) || [];

  const DOMAIN_COLORS = {
    executive: 'linear-gradient(135deg, #F13223, #ff6b4a)',
    engineering: 'linear-gradient(135deg, #1298B0, #0ea5e9)',
    product: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    marketing: 'linear-gradient(135deg, #a855f7, #c084fc)',
    operations: 'linear-gradient(135deg, #10b981, #34d399)',
    finance: 'linear-gradient(135deg, #06b6d4, #22d3ee)',
    design: 'linear-gradient(135deg, #ec4899, #f472b6)',
    data: 'linear-gradient(135deg, #6366f1, #818cf8)',
    legal: 'linear-gradient(135deg, #78716c, #a8a29e)',
  };

  // Start webcam
  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) { console.log('Camera not available'); }
    }
    if (isCameraOn) startCamera();
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
  }, [isCameraOn]);

  // Meeting timer
  useEffect(() => {
    if (!hasJoined) return;
    const timer = setInterval(() => setMeetingTime(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [hasJoined]);

  // Auto-play conversation script
  useEffect(() => {
    if (!hasJoined) return;
    if (!meeting?.scriptKey || !MEETING_SCRIPTS[meeting.scriptKey]) return;
    const script = MEETING_SCRIPTS[meeting.scriptKey];
    
    const timers = [];

    script.forEach((line, idx) => {
      const timer = setTimeout(() => {
        const speaker = getProfessionalById(line.speaker);
        if (!speaker) return;

        // Add to transcript
        setTranscript(prev => [...prev, {
          sender: speaker.name,
          senderId: speaker.id,
          profession: speaker.profession,
          text: line.text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isUser: false,
        }]);

        // Add to meeting notes
        setMeetingNotes(prev => [...prev, `${speaker.name}: ${line.text.substring(0, 80)}...`]);

        // Speak with voice synthesis
        speakAsAgent(speaker, line.text);

        setScriptIndex(idx + 1);
      }, line.delay);

      timers.push(timer);
    });

    return () => {
      timers.forEach(t => clearTimeout(t));
      window.speechSynthesis?.cancel();
    };
  }, [meeting, hasJoined]);

  // Scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const speakAsAgent = useCallback((agent, text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    window._lastUtterance = utterance; // Prevent garbage collection bug in Chrome

    const voices = voicesRef.current.length > 0 ? voicesRef.current : window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const englishVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) ||
                          voices.find(v => v.lang.startsWith('en')) || voices[0];
      utterance.voice = englishVoice;
    }

    const domainVoiceMap = {
      executive: { pitch: 0.9, rate: 0.95 },
      engineering: { pitch: 1.0, rate: 1.05 },
      product: { pitch: 1.05, rate: 1.0 },
      marketing: { pitch: 1.1, rate: 1.05 },
      operations: { pitch: 0.95, rate: 1.0 },
      finance: { pitch: 0.9, rate: 0.95 },
      design: { pitch: 1.1, rate: 1.0 },
      data: { pitch: 1.0, rate: 0.95 },
      legal: { pitch: 0.85, rate: 0.9 },
    };
    const voiceConfig = domainVoiceMap[agent.domain] || { pitch: 1.0, rate: 1.0 };
    utterance.pitch = voiceConfig.pitch;
    utterance.rate = voiceConfig.rate;
    utterance.volume = 1;

    utterance.onstart = () => setSpeakingId(agent.id);
    utterance.onend = () => setSpeakingId(null);

    window.speechSynthesis.speak(utterance);
  }, []);

  const handleSendMessage = useCallback(() => {
    if (!userInput.trim()) return;
    const message = userInput;
    setUserInput('');

    setTranscript(prev => [...prev, {
      sender: 'You',
      senderId: 'user',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: true,
    }]);

    // AI responds via first participant
    if (participants.length > 0) {
      setTimeout(() => {
        const responder = participants[0];
        const defaultResp = responder.interviewScript?.find(s => s.trigger === 'default');
        const responseText = defaultResp?.response || "That's noted. Let me factor that into our discussion.";

        setTranscript(prev => [...prev, {
          sender: responder.name,
          senderId: responder.id,
          profession: responder.profession,
          text: responseText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isUser: false,
        }]);

        speakAsAgent(responder, responseText);
      }, 1500);
    }
  }, [userInput, participants, speakAsAgent]);

  const handleEndCall = () => {
    window.speechSynthesis?.cancel();
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    navigate('/meetings');
  };

  const toggleCamera = () => {
    if (isCameraOn && streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
    }
    setIsCameraOn(!isCameraOn);
  };

  if (!meeting) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#1a1a2e', color: '#e8eaed' }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Meeting not found</h2>
          <button onClick={() => navigate('/meetings')} style={{ marginTop: 16, padding: '10px 24px', background: '#1a73e8', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer' }}>
            Back to Meetings
          </button>
        </div>
      </div>
    );
  }

  if (!hasJoined) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#1a1a2e', color: '#e8eaed' }}>
        <h2 style={{ marginBottom: 24, fontSize: '28px' }}>Ready to join?</h2>
        <p style={{ marginBottom: 32, color: '#a0aabf' }}>You are joining: {meeting.title}</p>
        <button 
          onClick={() => {
            // Unlock audio context synchronously
            if ('speechSynthesis' in window) {
              window.speechSynthesis.speak(new SpeechSynthesisUtterance(''));
            }
            setHasJoined(true);
          }} 
          style={{ padding: '12px 32px', fontSize: '16px', background: '#1a73e8', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <Video size={20} />
          Join Meeting
        </button>
      </div>
    );
  }

  // Calculate tile sizes based on number of participants
  const totalTiles = participants.length + 1; // +1 for user
  const gridCols = totalTiles <= 2 ? 2 : totalTiles <= 4 ? 2 : 3;
  const tileWidth = totalTiles <= 2 ? 'min(560px, 48%)' : totalTiles <= 4 ? 'min(400px, 48%)' : 'min(320px, 31%)';
  const tileHeight = totalTiles <= 4 ? 'min(340px, 42vh)' : 'min(260px, 30vh)';
  const gridWidth = showTranscript ? 'calc(100% - 360px)' : '100%';

  return (
    <div className="meeting-room">
      {/* Header */}
      <div className="meeting-header">
        <div className="meeting-header-left">
          <div className="meeting-title">{meeting.title}</div>
          <div className="meeting-timer">
            <div className="meeting-recording-dot" />
            <span>{formatTime(meetingTime)}</span>
          </div>
        </div>
        <div className="meeting-header-right">
          <div className="meeting-participant-count">
            <Users size={16} />
            <span>{totalTiles} participants</span>
          </div>
        </div>
      </div>

      {/* Video Grid + Transcript */}
      <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        {/* Video Grid */}
        <div className="meeting-video-grid" style={{ width: gridWidth, transition: 'width 0.3s' }}>
          {/* User tile */}
          <div className="meeting-video-tile user-tile" style={{ width: tileWidth, height: tileHeight }}>
            {isCameraOn ? (
              <video ref={videoRef} autoPlay muted playsInline style={{ borderRadius: 12 }} />
            ) : (
              <div style={{ width: 70, height: 70, borderRadius: '50%', background: '#3c4043', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: '#e8eaed' }}>
                You
              </div>
            )}
            <div className="meeting-tile-name">
              <span>You (Founder)</span>
              <div className="meeting-tile-mic">
                {isMicOn ? <Mic size={12} /> : <MicOff size={12} style={{ color: '#ea4335' }} />}
              </div>
            </div>
          </div>

          {/* AI participant tiles */}
          {participants.map(p => (
            <div
              key={p.id}
              className={`meeting-video-tile ${speakingId === p.id ? 'speaking' : ''}`}
              style={{ width: tileWidth, height: tileHeight }}
            >
              <div
                className={`meeting-ai-avatar ${speakingId === p.id ? 'speaking' : ''}`}
                style={{ background: DOMAIN_COLORS[p.domain], width: totalTiles > 4 ? 60 : 70, height: totalTiles > 4 ? 60 : 70, fontSize: totalTiles > 4 ? 20 : 24 }}
              >
                {p.initials}
              </div>
              <div className="meeting-tile-name">
                <span>{p.name} • {p.profession.split(' ').slice(-2).join(' ')}</span>
                <div className="meeting-tile-mic">
                  {speakingId === p.id ? (
                    <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 12 }}>
                      {[0,1,2].map(i => (
                        <div key={i} style={{
                          width: 3, background: '#1a73e8', borderRadius: 1,
                          animation: `equalizer 0.5s ease-in-out ${i * 0.15}s infinite alternate`,
                          height: [8, 12, 6][i],
                        }} />
                      ))}
                      <style>{`@keyframes equalizer { from { height: 3px; } to { height: 12px; } }`}</style>
                    </div>
                  ) : <Mic size={12} />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Transcript Panel */}
        {showTranscript && (
          <div className="meeting-transcript">
            <div className="meeting-transcript-header">
              <h3>Meeting Transcript</h3>
              <button onClick={() => setShowTranscript(false)} style={{ background: 'none', border: 'none', color: '#9aa0a6', cursor: 'pointer', padding: 4 }}>
                <X size={18} />
              </button>
            </div>

            <div className="meeting-transcript-body">
              {transcript.length === 0 && (
                <div style={{ textAlign: 'center', color: '#5f6368', fontSize: 13, paddingTop: 32 }}>
                  Meeting starting...
                </div>
              )}
              {transcript.map((msg, i) => (
                <div key={i} className="transcript-message">
                  <div className={`transcript-sender ${msg.isUser ? 'user-sender' : ''}`}>
                    {msg.sender}
                    {msg.profession && <span style={{ fontSize: 10, color: '#5f6368', marginLeft: 6 }}>({msg.profession})</span>}
                  </div>
                  <div className="transcript-text">{msg.text}</div>
                  <div className="transcript-time">{msg.time}</div>
                </div>
              ))}
              <div ref={transcriptEndRef} />
            </div>

            {/* Meeting Notes Summary */}
            {meetingNotes.length > 0 && (
              <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#5f6368', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FileText size={12} /> Auto-Generated Notes
                </div>
                <div style={{ maxHeight: 100, overflowY: 'auto' }}>
                  {meetingNotes.slice(-3).map((note, i) => (
                    <div key={i} style={{ fontSize: 11, color: '#9aa0a6', marginBottom: 4, lineHeight: 1.4 }}>• {note}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="transcript-input-area">
              <input
                type="text"
                placeholder="Send a message..."
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleSendMessage}>
                <Send size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="meeting-controls">
        <button className={`meeting-control-btn ${!isMicOn ? 'muted' : ''}`} onClick={() => setIsMicOn(!isMicOn)} title={isMicOn ? 'Mute' : 'Unmute'}>
          {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
        </button>
        <button className={`meeting-control-btn ${!isCameraOn ? 'muted' : ''}`} onClick={toggleCamera} title={isCameraOn ? 'Turn off camera' : 'Turn on camera'}>
          {isCameraOn ? <Video size={20} /> : <VideoOff size={20} />}
        </button>
        <button className="meeting-control-btn" title="Present (disabled)" style={{ opacity: 0.4, cursor: 'default' }}>
          <Monitor size={20} />
        </button>
        <button className="meeting-control-btn end-call" onClick={handleEndCall} title="Leave meeting">
          <Phone size={20} style={{ transform: 'rotate(135deg)' }} />
        </button>
        <div style={{ width: 24 }} />
        <button
          className={`meeting-control-btn chat-btn ${!showTranscript ? '' : 'active'}`}
          onClick={() => setShowTranscript(!showTranscript)}
          title="Toggle transcript"
        >
          <MessageSquare size={20} />
          {!showTranscript && transcript.length > 0 && <div className="notification-dot" />}
        </button>
      </div>
    </div>
  );
}
